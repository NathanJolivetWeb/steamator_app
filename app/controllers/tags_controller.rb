class TagsController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    @tags = Tag.all

    if params[:query].present?
      @tags = @tags.where('title ILIKE ?', "%#{params[:query]}%")
    end

    respond_to do |format|
      format.html # Follow regular flow of Rails
      format.text { render partial: 'list.html', locals: { tags: @tags } }
    end
  end
end
