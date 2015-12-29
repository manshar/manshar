#!/bin/env ruby
# encoding: utf-8

class Recommendation < ActiveRecord::Base
  paginates_per 500
  belongs_to :user, counter_cache: true
  belongs_to :article, counter_cache: true

  validates_uniqueness_of :user_id, scope: :article_id

  has_many :notifications, -> { where notified_object_type: 'Recommendation'},
      foreign_key: :notified_object_id, dependent: :destroy,
      class_name: 'Mailboxer::Notification'

  after_commit :maybe_create_notification, on: :create

  # Recommendations for published articles.
  def self.published
    joins(:article).where(:articles => {:published => true})
  end

  private

  # Only notify the user when they get 5, 10, 15, 20... recommendations.
  def should_notify?
    # The + 1 is because recommendations_count is not updated until the
    # recommendation is saved.
    (article.recommendations_count > 0 and
     (article.recommendations_count + 1).modulo(5) == 0)
  end

  def maybe_create_notification
    # TODO(mkhatib): If someone likes and dislikes and likes again consequently
    # we'll send many emails. We need to catch this and make sure not to spam
    # the user.
    if should_notify?
      subject = I18n.t('notifications.recommendations.subject',
          recommendations_count: article.recommendations_count,
          article_title: article.title)
      body = I18n.t('notifications.recommendations.body_html',
          recommendations_count: article.recommendations_count,
          article_title: article.title,
          article_id: article.id)
      article.user.notify(subject, body, self)
    end
  end

end
