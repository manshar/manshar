class AddCategoryIdToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :category_id, :integer

    Article.find_each do |article|
      article.update_attributes(
          category_id: article.topic ? article.topic.category_id : nil)
    end

  end
end
