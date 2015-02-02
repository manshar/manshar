class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :title, :null => false
      t.integer :articles_count, :default => 0
      t.integer :category_id, :null => false

      t.timestamps
    end
    add_column :articles, :topic_id, :integer
  end
end
