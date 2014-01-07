class Article < ActiveRecord::Base

  belongs_to :user

  dragonfly_accessor :cover do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

  # Class Methods.
  def self.public
    Article.where(published: true)
  end

  # Instance Methods.
  def publish!
    self.published = true
    self.save
  end

  def draft?
    not self.published
  end

end
