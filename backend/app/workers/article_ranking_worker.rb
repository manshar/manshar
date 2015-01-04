class ArticleRankingWorker
  include Sidekiq::Worker

  sidekiq_options retry: false

  app_start_time = Time.local(2014, 1, 1).to_i
  @@RANKING_START_SECONDS = ENV['RANKING_START_SECONDS'] || app_start_time
  @@RANKING_LOG_BASE = ENV['RANKING_LOG_BASE'] || 2
  @@RANKING_TIME_SCALE_CONSTANT = ENV['RANKING_TIME_SCALE_CONSTANT'] || 45000

  def self.score(recommendations_count, comments_count)
    recommendations_count + comments_count * 2
  end

  def self.hot(recommendations_count, comments_count, date)
    s = ArticleRankingWorker.score(recommendations_count, comments_count) || 0
    s = [s.abs, 1].max
    order = Math.log(s, @@RANKING_LOG_BASE)
    seconds = date.to_i - @@RANKING_START_SECONDS
    (order + seconds / @@RANKING_TIME_SCALE_CONSTANT).round(7)
  end

  def perform(article_id=nil)
    puts 'Ranking articles worker starting...'

    if not article_id.nil?
      article = Article.find(article_id)
      hotness = ArticleRankingWorker.hot(
          article.recommendations_count,
          article.comments_count,
          article.created_at)
      puts "Updating ranking for #{article.id} = #{hotness}..."
      article.update_attributes(hotness: hotness)
    else
      Article.find_each do |article|
        hotness = ArticleRankingWorker.hot(
            article.recommendations_count,
            article.comments_count,
            article.created_at)
        puts "Updating ranking for #{article.id} = #{hotness}..."
        article.update_attributes(hotness: hotness)
      end
    end

    puts 'Ranking articles worker finished!'
  end
end
