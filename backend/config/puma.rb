threads 0, 16
workers 2

preload_app!

on_restart do
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection_pool.disconnect!
  end
end

on_worker_boot do
  ActiveSupport.on_load(:active_record) do
    if Rails.application.config.database_configuration
      config = Rails.application.config.database_configuration[Rails.env]
      config['reaping_frequency'] = ENV['DB_REAP_FREQ'] || 10
      config['pool']              = ENV['DB_POOL']      || 5
      ActiveRecord::Base.establish_connection(config)
    end
  end
end