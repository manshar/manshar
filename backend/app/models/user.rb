class User < ActiveRecord::Base
  include Concerns::Utils
  paginates_per 50

  devise :database_authenticatable, :registerable,
      :recoverable, :rememberable, :trackable, :validatable,
      :confirmable, :omniauthable

  include DeviseTokenAuth::Concerns::User

  scope :publishers, -> { where('published_articles_count > 0') }
  scope :top, -> { order('published_articles_count DESC') }

  acts_as_messageable

  has_many :articles, dependent: :destroy
  has_many :images, dependent: :destroy
  has_many :recommendations, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :links, dependent: :destroy

  dragonfly_accessor :avatar do
    default ENV['DEFAULT_AVATAR']
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end
  abs_url_for :avatar

  def published_articles
    articles.publishings.recents
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

  # There's a bug in devise_token_auth gem that adds a # before the query string
  # hence not allowing angular to see the search params.
  # https://github.com/lynndylanhurley/ng-token-auth/issues/112
  # TODO(mkhatib): Drop this when it is fixed.
  def generate_url(url, params = {})
    uri = URI(url)

    res = "#{uri.scheme}://#{uri.host}"
    res += ":#{uri.port}" if (uri.port and uri.port != 80 and uri.port != 443)
    res += "#{uri.path}" if uri.path
    res += "#{uri.fragment}" if uri.fragment
    res += "?#{params.to_query}"

    return res
  end

   # In v0.1.32.beta1 of devise_token_auth. There's a bug where expiry is not
   # working properly.
   # TODO(mkhatib): Drop this when new stable release is released.
  def build_auth_header(token, client_id='default')
    client_id ||= 'default'

    # client may use expiry to prevent validation request if expired
    # must be cast as string or headers will break
    expiry = self.tokens[client_id]['expiry'] || self.tokens[client_id][:expiry]

    return {
     "access-token" => token,
     "token-type"   => "Bearer",
     "client"       => client_id,
     "expiry"       => expiry.to_s,
     "uid"          => self.uid
    }
  end

end
