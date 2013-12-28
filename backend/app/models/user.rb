class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :token_authenticatable, :confirmable

  before_save :ensure_authentication_token

  has_many :articles, :dependent => :destroy
  has_many :images, :dependent => :destroy

  def published_articles
  	articles.where(published: true)
  end

  def drafts
  	articles.where(published: false)
  end

end
