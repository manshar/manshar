require 'dragonfly'

# Configure
Dragonfly.app.configure do
  plugin :imagemagick

  # TODO: Dragonfly changed their SHA algorithm and broke old images
  # make sure to revert this back to true once we figure out how to support
  # old images urls.
  verify_urls false
  secret ENV['DRAGONFLY_SECRET']

  url_format "/media/:job/:sha/:name"

  # Keep the images cached for 60 days.
  response_header "Cache-Control", "public, max-age=5184000"

  # List of allowed file paths when using fetch_file (strings or regexps)
  fetch_file_whitelist [
    /public/
  ]
  whitelist = [
    /www\.manshar\.com/,
    /api\.manshar\.com/,
  ]
  if not ENV["CDN_DOMAIN"].nil? and not ENV["CDN_DOMAIN"].empty?
    whitelist.push(/#{Regexp.escape(ENV["CDN_DOMAIN"])}/)
  end

  fetch_url_whitelist whitelist

  if Rails.env == 'test'
    datastore :memory
  elsif Rails.env == 'production'
    if not ENV["CDN_DOMAIN"].nil? and ENV["CDN_DOMAIN"].empty?
     url_host 'http://#{ENV["CDN_DOMAIN"]}' if ENV["CDN_DOMAIN"]
    end
    datastore :s3,
      bucket_name: ENV['S3_BUCKET_NAME'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
  else
    datastore :file,
      root_path: Rails.root.join('public/system/dragonfly', Rails.env),
      server_root: Rails.root.join('public')
  end

  # Override the .url method...
  define_url do |app, job, opts|
    thumb = Thumb.find_by_signature(job.signature)
    # If (fetch 'some_uid' then resize) has been stored already, give the datastore's remote url ...
    if thumb
      app.datastore.url_for(thumb.uid)
    # ...otherwise give the local Dragonfly server url
    else
      app.server.url_for(job)
    end
  end

  # Before serving from the local Dragonfly server...
  before_serve do |job, env|
    # ...store the thumbnail in the datastore...
    uid = job.store

    # ...keep track of its uid so next time we can serve directly from the datastore
    Thumb.create!(uid: uid, signature: job.signature)
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
