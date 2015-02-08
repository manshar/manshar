class Topic < ActiveRecord::Base

  belongs_to :category
  has_many :articles, dependent: :nullify

  # There should be only one topic with the same title in the same category.
  validates_uniqueness_of :title, scope: :category_id

end
