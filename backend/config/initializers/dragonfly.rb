require 'dragonfly'

# Configure
Dragonfly.app.configure do
  plugin :imagemagick

  protect_from_dos_attacks true
  secret ENV['DRAGONFLY_SECRET']

  url_format "/media/:job/:name"

  if Rails.env == 'test'
  	datastore :memory
  elsif Rails.env == 'production'
	  datastore :s3,
	    bucket_name: ENV['S3_BUCKET_NAME'],
	    access_key_id: ENV['AWS_ACCESS_KEY_ID'],
	    secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
	else
	  datastore :file,
	    root_path: Rails.root.join('public/system/dragonfly', Rails.env),
	    server_root: Rails.root.join('public')
  end
end

# Logger
Dragonfly.logger = Rails.logger

# Mount as middleware
Rails.application.middleware.use Dragonfly::Middleware

# Add model functionality
if defined?(ActiveRecord::Base)
  ActiveRecord::Base.extend Dragonfly::Model
  ActiveRecord::Base.extend Dragonfly::Model::Validations
end
