class GamesController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @games = Game.all
  end

  def new
    @game = Game.new
  end

  def create
    @game = game.new(game_params)
    if @game.save
      redirect_to games_path
    else
      render 'new'
    end
  end

  private

end
