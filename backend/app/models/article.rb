class Article < ActiveRecord::Base
  include Utils

  default_scope { order('created_at DESC') }
  belongs_to :user
  has_many :recommendations, :dependent => :destroy

  dragonfly_accessor :cover do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end


  scope :public, -> { where(published: true) }

  # Instance Methods.
  def publish!
    self.published = true
    self.save
  end

  def draft?
    not self.published
  end

  def cover_abs_url size = nil
    if size
      abs_url cover.thumb(size).url, ENV['API_HOST']
    else
      abs_url cover.url, ENV['API_HOST']
    end
  end
end
