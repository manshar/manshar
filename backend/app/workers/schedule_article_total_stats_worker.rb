class ScheduleArticleTotalStatsWorker
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { minutely }
  sidekiq_options retry: false

  def perform
    puts 'Collecting total stats for all articles schedule starting...'

    ArticleTotalStatsWorker.perform_async()

    puts 'collecting total stats for all articles schedule finished!'
  end
end
