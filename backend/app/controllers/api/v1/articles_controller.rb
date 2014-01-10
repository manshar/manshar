class Api::V1::ArticlesController < ApplicationController

  before_filter :authenticate_user!, except: [:index, :show]
  respond_to :json

  # GET /api/v1/articles
  # GET /api/v1/articles.json
  def index
    # Use the custom Article.public method to return all articles that is
    # marked published.
    @articles = Article.public
    authorize @articles
    render 'api/v1/articles/index'
  end

  # GET /api/v1/articles/1
  # GET /api/v1/articles/1.json
  def show
    @article = Article.find(params[:id])
    authorize @article
    render 'api/v1/articles/show'
  end

  # POST /api/v1/articles
  # POST /api/v1/articles.json
  def create
    @article = current_user.articles.new(article_params)
    authorize @article
    if @article.save
      render 'api/v1/articles/show', status: :created
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/articles/1
  # PATCH/PUT /api/v1/articles/1.json
  def update
    @article = Article.find(params[:id])
    authorize @article
    if @article.update(article_params)
      render 'api/v1/articles/show'
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/1
  # DELETE /api/v1/articles/1.json
  def destroy
    @article = Article.find(params[:id])
    authorize @article
    @article.destroy
    head :no_content
  end


  private

  def article_params
    params.require(:article).permit(:title, :tagline, :body, :published, :cover)
  end

end
