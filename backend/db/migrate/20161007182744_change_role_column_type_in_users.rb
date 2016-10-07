class ChangeRoleColumnTypeInUsers < ActiveRecord::Migration
  def change
    # This exteremly ugly, but it kept nagging about the transition from string to integer,
    # and because we have only 1..3 admins; this is an ok solution for it.
    remove_column :users, :role
    add_column :users, :role, :integer, default: 1
  end
end
