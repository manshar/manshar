class AddPublishedArticlesCountToUsers < ActiveRecord::Migration
  def change
    add_column :users, :published_articles_count, :integer, default: 0

    User.find_each do |user|
      published_articles_size = user.published_articles.size
      if published_articles_size
        user.published_articles_count = user.published_articles.size
        user.save!
      end
    end

  end
end
