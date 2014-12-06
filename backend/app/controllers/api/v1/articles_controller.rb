class Api::V1::ArticlesController < ApplicationController
  respond_to :json

  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_article, only: [:show, :update, :destroy]

  # GET /api/v1/articles
  # GET /api/v1/articles.json
  def index
    # Use the custom Article.published method to return all articles that is
    # marked published.
    @articles = Article.published.recents
    respond_with(@articles)
  end

  # GET /api/v1/articles/1
  # GET /api/v1/articles/1.json
  def show
    authorize @article
    respond_with(@article)
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
    authorize @article
    @article.destroy
    head :no_content
  end


  private

    def set_article
      @article = Article.find(params[:id])
    end

    def article_params
      params.require(:article).permit(:title, :tagline, :body, :published, :cover)
    end

end
