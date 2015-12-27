class AddUserAvatarUrlToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :user_avatar_url, :string

    Article.find_each do |article|
      article.update_attributes(
          user_avatar_url: article.user.avatar_abs_url('400x400#'))
    end
  end
end
