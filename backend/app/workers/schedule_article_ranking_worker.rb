class ScheduleArticleRankingWorker
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { minutely(15) }
  sidekiq_options retry: false

  def perform
    puts 'Ranking all articles schedule starting...'

    Article.publishings.find_each do |article|
      ArticleRankingWorker.perform_async(article.id)
    end

    puts 'Ranking all articles schedule finished!'
  end
end
