class ArticleRankingWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  app_start_time = Time.local(2014, 1, 1)
  @@RANKING_START_SECONDS = (ENV['RANKING_START_SECONDS'] || app_start_time).to_i
  @@RANKING_LOG_BASE = (ENV['RANKING_LOG_BASE'] || 2).to_i
  @@RANKING_TIME_SCALE_CONSTANT = (ENV['RANKING_TIME_SCALE_CONSTANT']|| 45000).to_i
  @@RANKING_RECOMMENDATION_WEIGHT = (ENV['RANKING_RECOMMENDATION_WEIGHT'] || 2).to_i
  @@RANKING_COMMENTS_WEIGHT = (ENV['RANKING_COMMENTS_WEIGHT'] || 1).to_i

  def self.score(recommendations_count, comments_count)
    (recommendations_count * @@RANKING_RECOMMENDATION_WEIGHT +
     comments_count * @@RANKING_COMMENTS_WEIGHT)
  end

  def self.hot(recommendations_count, comments_count, date)
    s = ArticleRankingWorker.score(recommendations_count, comments_count) || 0
    order = Math.log([s.abs, 1].max, @@RANKING_LOG_BASE)
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
          article.published_at)
      puts "Updating ranking for #{article.id} = #{hotness}..."
      article.update_column(:hotness, hotness)
    else
      puts 'article_id was not passed. Nothing to do.'
    end

    puts 'Ranking articles worker finished!'
  end
end
