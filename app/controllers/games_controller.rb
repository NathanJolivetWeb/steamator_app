class GamesController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @games = Game.all
  end
end
