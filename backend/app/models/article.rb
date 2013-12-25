class Article < ActiveRecord::Base

	belongs_to :user

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
