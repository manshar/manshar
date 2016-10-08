class AddConstraintToPickables < ActiveRecord::Migration
  def change
    add_index :pickabilities, [:user_id, :pickable_type, :pickable_id], name: "idx_user_pickabilities_on_pickabiility_id_and_type", unique: true, using: :btree
  end
end
