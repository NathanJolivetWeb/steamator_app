class Game < ApplicationRecord
  require 'json'
  has_one_attached :photo
  has_many :game_tags, dependent: :destroy
  has_many :tags, through: :game_tags
  def api_url
    tags = self.tags.map(&:name).to_json
    url = "https://steamator-deploy-api-2-se3v7w64ha-ew.a.run.app/?price=#{self.price}&tags=#{tags}&short_desc=#{self.description}"
  end
end
