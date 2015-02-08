class AddColorToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :color, :string, default: '#a7a7a7'
    add_column :categories, :icon_cssclass, :string, default: 'fa-tag'
  end
end
