class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :guid
      t.text :body, :null => false

      t.integer :article_id, :null => false
      # Author.
      t.integer :user_id, :null => false

      t.timestamps
    end

    add_column :articles, :comments_count, :integer, :default => 0
    add_column :users, :comments_count, :integer, :default => 0
  end
end
