class Pickability < ActiveRecord::Base
  belongs_to :editor, class_name: 'User'
  belongs_to :pickable, polymorphic: true
end
