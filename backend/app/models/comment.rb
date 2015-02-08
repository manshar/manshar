#!/bin/env ruby
# encoding: utf-8

class Comment < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :article, :counter_cache => true

  has_many :notifications, -> { where notified_object_type: 'Comment'},
      foreign_key: :notified_object_id

  # Comments for published articles.
  def self.published
    joins(:article).where(:articles => {:published => true})
  end

  after_commit :create_notification, on: :create

  # TODO(mkhatib): Link to the specific location of the comment and handle it
  # on the webclient to open the drawer on that comment and highlight it.
  def create_notification
    host = ENV['WEB_CLIENT_HOST']
    url = "http://#{host}/articles/#{article.id}"

    # Notify the article author of the new comment
    subject = "#{user.name} علق على مقالك '#{article.title}'"
    body = "#{user.name} ترك تعليق على مقالك <a href='#{url}' target='blank'>'#{article.title}'</a>. التعليق هو:\n\n <blockquote dir='rtl'>#{self.body}</blockquote>"

    if not user.id.equal? article.user.id
      SendEmailsWorker.perform_async(
          subject, body, article.user_id, self.class.name, self.id)
    end

    # Notify any users who have commented on the same section (i.e. guid).
    past_commenters = Comment.where(
        guid: guid).includes(:user).collect(&:user).uniq
    subject = "#{user.name} علق على مقال '#{article.title}'"
    body = "#{user.name} ترك تعليق على مقال <a href='#{url}' target='blank'>'#{article.title}'</a> بعد تعليقك. التعليق هو:\n\n <blockquote dir='rtl'>#{self.body}</blockquote>"
    past_commenters.each do |commenter|
      # Don't notify the owner of the article they already have been notified.
      # Or the user who is adding the current comment.
      if (not commenter.id.equal? article.user.id and
          not commenter.id.equal? user.id)
        SendEmailsWorker.perform_async(
            subject, body, commenter.id, self.class.name, self.id)
      end
    end

  end

end
