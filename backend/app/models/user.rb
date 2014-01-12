class User < ActiveRecord::Base
  include Utils

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :token_authenticatable, :confirmable

  before_save :ensure_authentication_token

  has_many :articles, :dependent => :destroy
  has_many :images, :dependent => :destroy

  dragonfly_accessor :avatar do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

  def published_articles
  	articles.where(published: true)
  end

  def drafts
  	articles.where(published: false)
  end

  def avatar_abs_url size = nil
    if size
      abs_url avatar.thumb(size).url, ENV['API_HOST']
    else
      abs_url avatar.url, ENV['API_HOST']
    end
  end
end
