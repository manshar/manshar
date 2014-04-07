class Api::V1::RecommendationsController < ApplicationController

  skip_before_filter :authenticate_user!, only: [:index]

  before_filter :load_parent
  respond_to :json

  # GET /articles/:article_id/recommendations
  # GET /articles/:article_id/recommendations.json
  # GET /users/:user_id/recommendations
  # GET /users/:user_id/recommendations.json
  def index
    @recommendations = @parent.recommendations
    authorize @recommendations
    render 'api/v1/recommendations/index'
  end

  # POST /articles/:id/recommendations
  # POST /articles/:id/recommendations.json
  def create
    @recommendation = current_user.recommendations.new(
        :article_id => params[:article_id])
    authorize @recommendation
    if @recommendation.save
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
    @recommendation.destroy

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

end
