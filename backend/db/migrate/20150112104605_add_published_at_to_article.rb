class AddPublishedAtToArticle < ActiveRecord::Migration
  def change
    add_column :articles, :published_at, :datetime

    Article.find_each do |article|
      if article.published
        article.published_at = article.created_at
        article.save!
      end
    end

  end
end
