class AddHotnessToArticle < ActiveRecord::Migration
  def change
    add_column :articles, :hotness, :float, :default => 0
  end
end
