class SendEmailsWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  COOLDOWN_PERIOD = 5.minutes

  def perform(user_id)
    user = User.find(user_id)

    if !user.confirmed?
      Rails.logger.info "Not sending notifications to unconfirmed email #{user.email}"
      return
    end

    ActiveRecord::Base.transaction do
      receipts = user.receipts.where(is_read: false).lock(true)
      most_recent = receipts.map(&:created_at).max
      # If the cooldown period already passed since we last sent a notification
      # to the user.
      if most_recent && (most_recent < (Time.now - COOLDOWN_PERIOD))
        # Find all undelivered notifications and send email to the user.
        notifications = Mailboxer::Notification.find(receipts.map(&:notification_id))
        Rails.logger.info "Sending #{notifications.size} notification(s) to #{user.email}"
        NotificationMailer.new_notification_email(notifications, user).deliver

        # Mark all receipts as read.
        receipts.update_all(is_read: true)
      else
        Rails.logger.info "Waiting before sending notifications to #{user.email}"
      end
    end
  end

end
