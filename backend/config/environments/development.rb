Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.
  config.i18n.default_locale = :ar

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  config.action_mailer.default_url_options = { :host => 'localhost:3000' }

  OmniAuth.config.full_host = "http://#{ENV['API_HOST']}"

  # To allow and test sending emails in development uncomment the following
  # lines and set the required environment variables.
  # config.roadie.url_options = {
  #     host: ENV['WEB_CLIENT_HOST'].split(':')[0],
  #     port: ENV['WEB_CLIENT_HOST'].split(':')[1],
  #     scheme: "http"
  # }
  # config.action_mailer.default_url_options = { :host => ENV['API_HOST'] }
  # config.action_mailer.delivery_method = :smtp
  # config.action_mailer.smtp_settings = {
  #   :authentication => :plain,
  #   :address => ENV['SMTP_HOSTNAME'],
  #   :port => 587,
  #   :domain => ENV['SMTP_DOMAIN'],
  #   :user_name => ENV['SMTP_USERNAME'],
  #   :password => ENV['SMTP_PASSWORD'],
  # }

  # Allow Cross-Origin Resource Sharing header to allow cross
  # domain xhr requests.
  config.middleware.insert_before Warden::Manager, Rack::Cors do
    allow do
      origins '*'
      resource '*',
      :headers => :any,
      :expose => ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      :methods => [:get, :delete, :post, :put, :options]
    end
  end
end
