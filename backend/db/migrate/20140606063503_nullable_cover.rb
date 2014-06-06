class NullableCover < ActiveRecord::Migration
  def change
    change_column :articles, :cover_uid, :string, :null => true
  end
end
