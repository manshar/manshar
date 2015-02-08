desc "This task is called by the Heroku scheduler add-on"
namespace :articles do
  task :update_hotness => :environment do
    puts "Updating articles hotness..."
    ArticleRankingWorker.perform_async
    puts "done."
  end
end
