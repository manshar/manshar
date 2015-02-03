class User < ActiveRecord::Base
  include Utils

  scope :publishers, -> { where('published_articles_count > 0') }
  scope :top, -> { order('published_articles_count DESC') }

  acts_as_messageable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :token_authenticatable, :confirmable

  before_save :ensure_authentication_token

  has_many :articles, :dependent => :destroy
  has_many :images, :dependent => :destroy
  has_many :recommendations, :dependent => :destroy
  has_many :comments, :dependent => :destroy

  dragonfly_accessor :avatar do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end
  abs_url_for :avatar

  def published_articles
    articles.public.recents
  end

  def drafts
    articles.drafts.recents
  end

  def admin
    role == 'admin'
  end

  def staff
    role == 'staff'
  end

  def mailboxer_email(object)
    email
  end
end
