class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :title, :null => false, :default => ''
      t.text :caption, :null => false, :default => ''
      t.integer :user_id, :null => false, :default => ''
      t.attachment :img

      t.timestamps
    end
  end
end
