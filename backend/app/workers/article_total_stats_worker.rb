require 'google/api_client'

class ArticleTotalStatsWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def self.get_authorized_client
    private_key = ENV['GOOGLE_PRIVATE_KEY']
    passphrase = ENV['GOOGLE_PRIVATE_KEY_PASSPHRASE']
    key = OpenSSL::PKey::RSA.new private_key, passphrase

    client = Google::APIClient.new
    client.authorization = Signet::OAuth2::Client.new(
        :token_credential_uri => 'https://accounts.google.com/o/oauth2/token',
        :audience => 'https://accounts.google.com/o/oauth2/token',
        :scope => 'https://www.googleapis.com/auth/analytics.readonly',
        :issuer => ENV['GOOGLE_SERVICE_ACCOUNT'],
        :signing_key => key)
    client.authorization.fetch_access_token!
    client
  end

  # Autherize client
  @@client = ArticleTotalStatsWorker.get_authorized_client
  @@analytics = @@client.discovered_api('analytics', 'v3')

  def perform(start_index=1)
    puts "Articles stats worker starting at index #{start_index}..."

    # Query Analytics API  to retrieve Unique Page Views and Time on Page
    query_data = @@client.execute(:api_method => @@analytics.data.ga.get, :parameters => {
      'ids' => ENV['GOOGLE_ANALYTICS_PROFILE_ID'],
      'start-date' => '2014-01-01',
      'end-date' => DateTime.now.strftime("%Y-%m-%d"),
      'dimensions' => 'ga:pagePath',
      'metrics' => 'ga:uniquePageviews,ga:timeOnPage',
      'filters' => 'ga:pagePath=~^/articles/\d+$,ga:pagePath=~^/articles/\d+/$',
      'start-index' => start_index,
      'sort' => 'ga:pagePath'
    })

    response = Oj.load(query_data.body)
    rows_count = [response['itemsPerPage'], response['totalResults']].min

    puts "Loop over response rows  #{response['itemsPerPage']} out of #{response['totalResults']}"
    rows = response['rows']
    stat_map = rows.group_by do |row|
      match = row[0].match(/\/articles\/(\d+)/)
      if match
        match ? match[1].to_i : nil
      end
    end
    puts stat_map.length
    stat_map.each do |article_id, records|
      puts article_id, records
      if article_id.nil?
        next
      end
      unique_pageviews = 0
      time_on_page = 0
      for row in records
        unique_pageviews += row[1].to_i
        time_on_page += row[2].to_i
      end

      puts "Updating stats for article with ID #{article_id}..."
      article = Article.find_by_id(article_id.to_i)
      if article and article.published
        puts "Found article with #{article_id}..."
        title = article.title
        user_id = article.user_id
        comments_count = article.comments_count
        recommendations_count = article.recommendations_count
        reading_time = article.reading_time
        reads_count = time_on_page / 60 / [reading_time, 1].max
        # TODO: Get Facebook, Google and Twitter shares counts
        total_stats = TotalStat.find_or_create_by(article_id: article_id)

        total_stats.update_attributes(article_title: title,
          page_views_count: unique_pageviews,
          reads_count: reads_count,
          comments_count: comments_count,
          recommendations_count: recommendations_count,
          user_id: user_id)
      end
    end

    if (start_index + rows_count) < response['totalResults']
      puts 'More results available. Spin another worker'
      ArticleTotalStatsWorker.perform_async(start_index+rows_count)
    end

    puts 'Articles stats worker finished!'
  end
end
