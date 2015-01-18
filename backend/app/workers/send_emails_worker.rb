class SendEmailsWorker
  include Sidekiq::Worker

  sidekiq_options retry: false

  def perform(subject, body, user_id, resource_type, resource_id)
    puts 'Sending Email...'
    resource = resource_type.constantize.find(resource_id)
    User.find(user_id).notify(subject, body, resource)
    puts 'Email sent...'
  end
end
