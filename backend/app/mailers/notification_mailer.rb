class NotificationMailer < Mailboxer::NotificationMailer
  include Roadie::Rails::Automatic
  layout 'notification'

  def new_notification_email(notification, receiver)
    @notification = notification
    @receiver     = receiver
    template = 'new_notification_email'

    if notification.count < 2
      set_subject(notification[0])
      subject = t('mailboxer.notification_mailer.subject', subject: @subject)
    else
      subject = t('mailboxer.notification_mailer.multi_notification_subject',
          count: notification.size)
    end

    mail to: receiver.send(Mailboxer.email_method, notification),
         subject: subject,
         template_name: template
  end

end
