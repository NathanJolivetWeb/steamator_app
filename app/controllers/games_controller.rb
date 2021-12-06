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
  end

  def create
    @game = Game.new(game_params)
    @game.save
    redirect_to game_path(@game)
  end

  private

  def game_params
    params.require(:game).permit(:title, :description, :price, :photo)
  end

end
