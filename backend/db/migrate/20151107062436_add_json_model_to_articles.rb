class AddJsonModelToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :json_model, :text
  end
end
