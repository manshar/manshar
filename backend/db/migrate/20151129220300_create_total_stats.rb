class CreateTotalStats < ActiveRecord::Migration
  def change
    create_table :total_stats do |t|
      t.integer :article_id, null: false
      t.integer :user_id
      t.string :article_title
      t.integer :page_views_count, default: 0
      t.integer :reads_count, default: 0
      t.integer :comments_count, default: 0
      t.integer :recommendations_count, default: 0
      t.integer :facebook_shares_count, default: 0
      t.integer :twitter_shares_count, default: 0
      t.integer :plus_shares_count, default: 0
    end
  end
end
