# This is not needed for an api-only application, but rails4
# requires it to be defined, otherwise error is raised.
Backend::Application.config.secret_key_base = ENV['SECRET_TOKEN']

