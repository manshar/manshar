class Image < ActiveRecord::Base

  has_attached_file :img, :styles => {
  		:medium => '600x600>', :small => '300x300>'
  }

	validates_attachment :img, :presence => true,
  		:content_type => { :content_type => ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'] }

  belongs_to :user

end
