class Game < ApplicationRecord
  require 'json'
  has_one_attached :photo
  has_many :game_tags, dependent: :destroy
  has_many :tags, through: :game_tags
  validates :title, presence: true
  validates :description, presence: true
  validates :price, presence: true
  validates :photo, presence: true
  validates :website, presence: true
  validates :followers, presence: true
  validates :games_number, presence: true
  validates :english, presence: true

  BASE_URL = "https://steamator-deploy-api-2-se3v7w64ha-ew.a.run.app"

  # args []
  def api_url
    tags = self.tags.map(&:name).to_json
    return "#{BASE_URL}/predict_tags?tags=#{tags}"
  end

  # args [topic_proba: str, english: bool, has_a_website: bool, followers: int, nb_game_by_developer: int]
  def api_url2
    return "
            #{BASE_URL}/?short_desc=#{description}
            &title=#{title}
            &short_desc=#{description}
            &price=#{price}
            &has_a_website=#{website}
            &followers=#{followers}
            &nb_game_by_developer=#{games_number}
            &english=#{english}
          ".strip.delete!("\n").gsub(/\s+/, "")
  end
end
