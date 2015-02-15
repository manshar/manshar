class AddUserNameAndTopicTitleAndCategoryColorToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :user_name, :string
    add_column :articles, :topic_title, :string
    add_column :articles, :category_color, :string

    Article.find_each do |article|
      article.update_attributes(
          user_name: article.user.name,
          topic_title: article.topic ? article.topic.title : nil,
          category_color: article.category ? article.category.color : nil)
    end
  end
end
