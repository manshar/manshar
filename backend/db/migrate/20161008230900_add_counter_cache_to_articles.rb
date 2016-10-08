class AddCounterCacheToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :pickabilities_count, :integer, null: false, default: 0
  end
end
