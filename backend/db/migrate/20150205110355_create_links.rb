class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :title, :null => false, :default => ''
      t.string :url, :null => false, :default => ''
      t.integer :user_id, :null => false

      t.timestamps
    end
  end
end
