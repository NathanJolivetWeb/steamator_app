class AddColumnsToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :website, :boolean, default: false
    add_column :games, :english, :boolean, default: false
    add_column :games, :followers, :integer
    add_column :games, :games_number, :integer
  end
end
