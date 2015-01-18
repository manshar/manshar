#!/bin/env ruby
# encoding: utf-8

class Recommendation < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :article, :counter_cache => true

  validates_uniqueness_of :user_id, :scope => :article_id

  has_many :notifications, -> { where notified_object_type: 'Recommendation'},
      foreign_key: :notified_object_id

  after_commit :maybe_create_notification, on: :create

  # Recommendations for published articles.
  def self.published
    joins(:article).where(:articles => {:published => true})
  end

  private

  # Only notify the user when they get 5, 10, 15, 20... recommendations.
  def should_notify?
    (article.recommendations_count > 0 and
     article.recommendations_count.modulo(5) == 0)
  end

  def maybe_create_notification
    # TODO(mkhatib): If someone likes and dislikes and likes again consequently
    # we'll send many emails. We need to catch this and make sure not to spam
    # the user.
    if should_notify?
      host = ENV['WEB_CLIENT_HOST']
      url = "http://#{host}/articles/#{article.id}"
      subject = "#{article.recommendations_count} توصيات على مقالك '#{article.title}'"
      body = "وصل مقالك <a href='#{url}' target='blank'>'#{article.title}'</a> ل #{article.recommendations_count} توصيات."
      SendEmailsWorker.perform_async(
          subject, body, article.user_id, self.class.name, self.id)
    end
  end

end
