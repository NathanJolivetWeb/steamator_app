class Tag < ApplicationRecord
  has_many :games, through: :game_tags
end
