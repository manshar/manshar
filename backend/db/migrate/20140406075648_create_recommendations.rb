class CreateRecommendations < ActiveRecord::Migration
  def change
    create_table :recommendations do |t|
      t.integer :article_id
      t.integer :user_id

      t.timestamps
    end

    add_column :articles, :recommendations_count, :integer, :default => 0
    add_column :users, :recommendations_count, :integer, :default => 0
    add_index "recommendations", ["user_id", "article_id"], :unique => true
  end
end
