class Article < ActiveRecord::Base
  include Utils

  scope :popular, -> { order('hotness DESC') }
  scope :best, -> { order('recommendations_count DESC') }
  scope :recents, -> { order('created_at DESC') }

  belongs_to :user
  has_many :recommendations, :dependent => :destroy
  has_many :comments, :dependent => :destroy

  dragonfly_accessor :cover do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

  scope :public, -> { where(published: true) }
  scope :drafts, -> { where(published: false) }

  # Instance Methods.
  def publish!
    self.published = true
    self.save
  end

  def draft?
    not self.published
  end

  def cover_abs_url size = nil
    if cover.nil?
      return
    end
    if size
      abs_url cover.thumb(size).url, ENV['API_HOST']
    else
      abs_url cover.url, ENV['API_HOST']
    end
  end

  def next
    Article.public.popular.where('hotness < ?', hotness).first
  end

end
