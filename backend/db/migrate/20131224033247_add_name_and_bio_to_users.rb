class AddNameAndBioToUsers < ActiveRecord::Migration
  def change
    change_table(:users) do |t|
      t.string :name, :null => false, :default => ""
      t.string :bio, :default => ""
    end
  end
end
