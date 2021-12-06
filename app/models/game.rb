class Game < ApplicationRecord
  has_one_attached :photo
  has_many :game_tags
  has_many :tags, through: :game_tags
end
