class Article < ActiveRecord::Base
  include Concerns::Utils

  belongs_to :user
  has_many :recommendations, dependent: :destroy

  scope :published, -> { where(published: true) }
  scope :draft, -> { where(published: false) }
  scope :top, -> { order('recommendations_count DESC').order('created_at DESC') }
  scope :recents, -> { order('created_at DESC') }

  dragonfly_accessor :cover do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

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
end
