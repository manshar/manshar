ENV["RAILS_ENV"] ||= 'test'

require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'capybara/rspec'
require 'capybara/poltergeist'

Capybara.javascript_driver = :poltergeist

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

RSpec.configure do |config|
  config.mock_with :rspec

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  config.use_transactional_fixtures = true
  # config.use_transactional_fixtures = false
  # config.before(:suite) { DatabaseCleaner.strategy = :truncation }
  # config.before(:each)  { DatabaseCleaner.start }
  # config.after(:each)   { DatabaseCleaner.clean }

  config.infer_base_class_for_anonymous_controllers = false
  config.order = 'random'
end
