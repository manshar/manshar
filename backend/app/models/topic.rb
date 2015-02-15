class Topic < ActiveRecord::Base
  paginates_per 100

  belongs_to :category
  has_many :articles, dependent: :nullify

  # There should be only one topic with the same title in the same category.
  validates_uniqueness_of :title, scope: :category_id

end
