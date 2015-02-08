class AddProviderAndUidToUsers < ActiveRecord::Migration
  def change
    add_column :users, :provider, :string
    add_column :users, :uid, :string, null: false, default: ''
    add_column :users, :tokens, :text
    add_column :users, :nickname, :string

    User.find_each do |user|
      if user.uid.blank?
        user.uid = user.email
        user.provider = 'email'
        user.save!
      end
    end

    add_index :users, :uid, :unique => true
    add_index :users, :nickname, :unique => true
  end
end
