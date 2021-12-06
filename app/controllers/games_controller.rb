class GamesController < ApplicationController
  skip_before_action :authenticate_user!

  def show
    @game = Game.find(params[:id])
  end

  def index
    @games = Game.all
  end

  def new
    @game = Game.new
    @tags = Tag.all
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      params[:tags].each do |tag_id|
        @tag = Tag.find(tag_id)
        @game_tag = GameTag.create(game: @game, tag: @tag)
      end
      redirect_to game_path(@game)
    else
      render "games/new"
    end
  end

  private

  def game_params
    params.require(:game).permit(:title, :description, :price, :photo)
  end
end
