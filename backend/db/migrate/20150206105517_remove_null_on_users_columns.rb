class RemoveNullOnUsersColumns < ActiveRecord::Migration
  def change
    change_column :users, :avatar_uid, :string, :null => true
  end
end
