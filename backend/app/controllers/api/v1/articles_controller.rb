class Api::V1::ArticlesController < ApplicationController
  respond_to :json

  after_action :verify_authorized, except: [:index]
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_article, only: [:show, :update, :destroy]
  before_action :load_query, only: [:index]

  # GET /api/v1/articles
  # GET /api/v1/articles.json
  # GET /api/v1/categories/1/articles
  # GET /api/v1/categories/1/articles.json
  # GET /api/v1/categories/1/topics/1/articles
  # GET /api/v1/categories/1/topics/1/articles.json
  def index
    # Use the custom Article.published method to return all articles that is
    # marked published.
    @articles = @query.publishings.try(order_param).page(params[:page])
    render 'api/v1/articles/index'
  end

  # GET /api/v1/articles/1
  # GET /api/v1/articles/1.json
  def show
    authorize @article
    @next = @article.next
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
    authorize @article
    if @article.update(article_params)
      ArticleRankingWorker.perform_async(@article.id) if @article.published
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

    def load_query
      if params[:topic_id]
        @query = Topic.find(params[:topic_id]).articles.publishings
      elsif params[:category_id]
        @query = Category.find(params[:category_id]).articles.publishings
      else
        @query = Article.publishings
      end
    end

    def article_params
      params.require(
        :article).permit(
          :title, :tagline, :body, :published, :cover, :topic_id, :category_id)
    end

    def order_param
      # It is important not to allow other values for order otherwise
      # users can run malicious method on all articles :-).
      permitted_orders = ['popular', 'best', 'recents']
      if permitted_orders.include?(params[:order])
        params[:order]
      else
        :best
      end
    end

end
