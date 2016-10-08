class CreatePickabilities < ActiveRecord::Migration
  def change
    create_table :pickabilities do |t|
      t.references :user, index: true
      t.references :pickable, polymorphic: true, index: true

      t.timestamps null: false
    end
    add_foreign_key :pickabilities, :users
  end
end
