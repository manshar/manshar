class Article < ActiveRecord::Base
  include Concerns::Utils
  paginates_per 15

  has_one :total_stat
  belongs_to :user
  belongs_to :topic
  belongs_to :category
  has_many :recommendations, dependent: :destroy
  has_many :comments, dependent: :destroy

  scope :publishings, -> { where(published: true) }
  scope :drafts, -> { where(published: false) }

  scope :popular, -> { order('hotness DESC') }
  scope :best, -> { order('recommendations_count DESC') }
  scope :recents, -> { order('published_at DESC') }
  scope :recently_updated, -> { order('updated_at DESC') }

  before_save :published_post, :time_to_read
  after_save :update_published_articles_count

  dragonfly_accessor :cover do
    storage_options do |attachment|
      {
        root_path: 'articles/covers/',
        headers: {'x-amz-acl' => 'public-read-write'}
      }
    end
  end
  abs_url_for :cover


  def user_name
    user.name
  end
  persistize :user_name

  def user_avatar_url
    user.avatar_abs_url('400x400#')
  end
  persistize :user_avatar_url

  def topic_title
    topic ? topic.title : nil
  end
  persistize :topic_title

  def category_color
    category ? category.color : nil
  end
  persistize :category_color



  # Instance Methods.
  def publish!
    self.published = true
    self.save
  end

  # Add published at date only for the published posts.
  def published_post
    if self.published && self.published_at.nil?
      self.published_at = Time.now
    end
  end

  def draft?
    not self.published
  end

  def next(count=1)
    query = Article.publishings.popular
    next_articles = query.where('hotness < ?', hotness)[0..count-1]
    if next_articles.nil?
      next_articles = query.where('hotness > ?', hotness)[0..count-1]
    end
    next_articles
  end

  def time_to_read
    self.reading_time = (word_count / 200.0).round
  end

  def word_count
    self.body.split.size
  end

  def update_published_articles_count
    # TODO(mkhatib): Move this operation to a worker?
    # TODO(mkhatib): Also update the cached number of articles in topics and categories.
    self.user.published_articles_count = self.user.published_articles.count
    self.user.save
  end

end
