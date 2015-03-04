class AccountsMailer < Devise::Mailer
  include Roadie::Rails::Automatic
  include Devise::Controllers::UrlHelpers

  layout 'notification'
  default template_path: 'devise/mailer'
  default url_options: { host: ENV['API_HOST'] }
end
