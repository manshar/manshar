class Api::V1::UsersArticlesController < ApplicationController
  respond_to :json

  after_filter :verify_authorized, except: [:index, :drafts]
  after_filter :verify_policy_scoped, :only => [:drafts]

  before_filter :authenticate_user!, except: [:index]

  # GET /api/v1/users/1/articles
  # GET /api/v1/users/1/articles.json
  def index
    if profile
      @articles = profile.published_articles
      render 'api/v1/articles/index'
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  # GET /api/v1/me/drafts
  # GET /api/v1/me/drafts.json
  def drafts
    @articles = policy_scope(current_user.drafts)
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
