class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :emailaddress
      t.string :location
      t.date :date
      t.string :other

      t.timestamps
    end
  end
end
