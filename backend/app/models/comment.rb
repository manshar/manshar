#!/bin/env ruby
# encoding: utf-8

class Comment < ActiveRecord::Base
  paginates_per 500
  belongs_to :user, :counter_cache => true
  belongs_to :article, :counter_cache => true

  has_many :notifications, -> { where notified_object_type: 'Comment'},
      foreign_key: :notified_object_id, dependent: :destroy,
      class_name: 'Mailboxer::Notification'

  default_scope { order('created_at') }

  # Comments for published articles.
  def self.published
    joins(:article).where(:articles => {:published => true})
  end

  after_commit :create_notification, on: :create

  # TODO(mkhatib): Link to the specific location of the comment and handle it
  # on the webclient to open the drawer on that comment and highlight it.
  def create_notification
    host = ENV['WEB_CLIENT_HOST']
    # Notify the article author of the new comment
    subject = I18n.t('notifications.comments.subject',
        user_name: user.name, article_title: article.title)
    body = I18n.t('notifications.comments.body_html',
        user_id: user.id, user_name: user.name,
        article_id: article.id, article_title: article.title,
        comment_body: self.body)

    if not user.id.equal? article.user.id
      article.user.notify(subject, body, self)
    end

    # Notify any users who have commented on the same section (i.e. guid).
    past_commenters = Comment.where(
        guid: guid).includes(:user).collect(&:user).uniq
    subject = I18n.t('notifications.comments.reply.subject',
        user_name: user.name, article_title: article.title)
    body = I18n.t('notifications.comments.reply.body_html',
        user_id: user.id, user_name: user.name,
        article_id: article.id, article_title: article.title,
        comment_body: self.body)

    past_commenters.each do |commenter|
      # Don't notify the owner of the article they already have been notified.
      # Or the user who is adding the current comment.
      if (not commenter.id.equal? article.user.id and
          not commenter.id.equal? user.id)
        commenter.notify(subject, body, self)
      end
    end

  end

end
