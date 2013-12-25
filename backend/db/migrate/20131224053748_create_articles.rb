class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title, :null => false, :default => ''
      t.string :tagline, :null => false, :default => ''
      t.text :body, :null => false, :default => ''

      # Enable to save articles as drafts.
      t.boolean :published, :null => false, :default => false

      # Author.
      t.integer :user_id, :null => false, :default => 1

      t.timestamps
    end
  end
end
