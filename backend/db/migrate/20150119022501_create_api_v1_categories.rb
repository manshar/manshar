class CreateApiV1Categories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :title, null: false
      t.text :description
      t.string :image_uid
      t.string :icon_uid

      t.integer :topics_count, default: 0
      t.integer :articles_count, default: 0

      t.timestamps
    end
  end
end
