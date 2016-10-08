class Pickability < ActiveRecord::Base
  belongs_to :editor, class_name: 'User'
  belongs_to :pickable, polymorphic: true, counter_cache: :pickabilities_count

  validates_uniqueness_of :pickable_id, scope: [:user_id, :pickable_type]
end
