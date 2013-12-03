source 'https://rubygems.org'

gem 'rails', '4.0.1'

gem 'pg', platforms: :ruby
gem 'activerecord-jdbcpostgresql-adapter', platforms: :jruby

gem 'devise', '3.1.1'

gem 'inherited_resources', '1.4.1'
gem 'kaminari'

gem 'simple_form'

gem 'sass-rails', '~> 4.0.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'

gem 'bourbon'
gem 'neat'

gem 'mobvious'
gem 'foreman'
gem 'dotenv-rails'

group :production do
  gem 'therubyracer', platforms: :ruby
  gem 'rails_12factor'
  gem 'puma'
end

group :development do
  # gem 'rack-mini-profiler'
  gem 'quiet_assets'
  gem 'bullet'
  gem 'binding_of_caller'
  gem 'better_errors'
  gem 'pry'
  gem 'awesome_print'
end

group :test, :development do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'rb-fsevent', require: RUBY_PLATFORM =~ /darwin/i ? 'rb-fsevent' : false
  gem 'rb-inotify', '~> 0.9', require: RUBY_PLATFORM =~ /linux/i ? 'rb-inotify' : false
  gem 'database_cleaner'
  gem 'guard-rspec'
  gem 'fuubar'

  gem 'capybara'
  gem 'poltergeist'
  gem 'phantomjs'

  gem 'teaspoon'
  gem 'guard-teaspoon'
end
