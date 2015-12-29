class Api::V1::RecommendationsController < ApplicationController
  respond_to :json

  before_action :load_parent
  before_action :authenticate_user!, except: [:index]
  after_action :verify_authorized, except: [:index]


  # GET /articles/:article_id/recommendations
  # GET /articles/:article_id/recommendations.json
  # GET /users/:user_id/recommendations
  # GET /users/:user_id/recommendations.json
  def index
    @load_content = preload_content
    @recommendations = policy_scope(
        @parent.recommendations
          .page(params[:page])
          .per(per_param)
          .preload(preload_content))
    render 'api/v1/recommendations/index'
  end

  # POST /articles/:id/recommendations
  # POST /articles/:id/recommendations.json
  def create
    @recommendation = current_user.recommendations.new(
        :article_id => params[:article_id])
    authorize @recommendation
    if @recommendation.save
      ArticleRankingWorker.perform_async(params[:article_id])
      render 'api/v1/recommendations/show', status: :created
    else
      render json: @recommendation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /articles/:id/recommendations
  # DELETE /articles/:id/recommendations
  def destroy
    @recommendation = Recommendation.find(params[:id])
    authorize @recommendation
    if @recommendation.destroy
      ArticleRankingWorker.perform_async(@recommendation.article_id)
    end

    head :no_content
  end

  private
  def load_parent
    if params[:user_id]
      @parent =  User.find(params[:user_id])
    elsif params[:article_id]
      @parent =  Article.find(params[:article_id])
    end
  end

  def per_param
    if params[:per]
      params[:per]
    # Paginate users recommendation listing requests to 10 per page.
    elsif params[:user_id]
      10
    # Paginate article recommendation listing requests to 500 per page.
    elsif params[:article_id]
      500
    end
  end

  # When the request is for articles recommendations, preload the user object
  # otherwise preload the article.
  def preload_content
    params[:article_id] ? :user : :article
  end

end
