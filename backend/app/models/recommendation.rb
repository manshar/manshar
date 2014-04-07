class Recommendation < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :article, :counter_cache => true

  validates_uniqueness_of :user_id, :scope => :article_id
end
