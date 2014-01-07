class AddAvatarAndCoverToUserAndArticle < ActiveRecord::Migration
  def change
    change_table(:users) do |t|
      t.string :avatar_uid, :null => false
      t.string :avatar_name
    end

    change_table(:articles) do |t|
      t.string :cover_uid, :null => false
      t.string :cover_name
    end
  end
end
