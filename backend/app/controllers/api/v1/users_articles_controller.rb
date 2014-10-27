class Api::V1::UsersArticlesController < ApplicationController
  before_filter :authenticate_user!, except: [:index]
  respond_to :json

  # GET /api/v1/users/1/articles
  # GET /api/v1/users/1/articles.json
  def index
    if profile
      @articles = profile.published_articles
      authorize @articles
      render 'api/v1/articles/index'
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  # GET /api/v1/me/drafts
  # GET /api/v1/me/drafts.json
  def drafts
    @articles = current_user.drafts
    authorize @articles
    render 'api/v1/articles/index'
  end

  private
  def profile
    if params[:user_id].nil?
      current_user
    else
      User.find(params[:user_id])
    end
  end

end
