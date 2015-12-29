class Api::V1::CommentsController < ApplicationController
  respond_to :json

  after_action :verify_authorized, except: [:index]
  before_action :authenticate_user!, except: [:index]
  before_action :load_parent

  # GET /api/v1/articles/1/comments
  # GET /api/v1/articles/1/comments.json
  # GET /api/v1/users/1/comments
  # GET /api/v1/users/1/comments.json
  def index
    @load_content = preload_content
    @comments = policy_scope(
        @parent.comments
          .page(params[:page])
          .per(per_param)
          .preload(preload_content))
    render 'api/v1/comments/index'
  end

  # POST /api/v1/articles/1/comments
  # POST /api/v1/articles/1/comments.json
  def create
    @comment = current_user.comments.new(comment_params)
    @comment.article_id = params[:article_id]
    @load_content = preload_content
    authorize @comment
    if @comment.save
      ArticleRankingWorker.perform_async(params[:article_id])
      render 'api/v1/comments/show', status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/articles/1/comments/1
  # PATCH/PUT /api/v1/articles/1/comments/1.json
  def update
    @comment = Comment.find(params[:id])
    authorize @comment
    if @comment.update(comment_params)
      render 'api/v1/comments/show', status: :success
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/1/comments/1
  # DELETE /api/v1/articles/1/comments/1.json
  def destroy
    @comment = Comment.find(params[:id])
    authorize @comment
    if @comment.destroy
      ArticleRankingWorker.perform_async(params[:article_id])
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
    # Paginate users comments listing requests to 10 per page.
    elsif params[:user_id]
      10
    # Paginate article comments listing requests to 500 per page.
    elsif params[:article_id]
      500
    end
  end

  def comment_params
    params.require(:comment).permit(:body, :guid)
  end

  # When the request is for articles comments, preload the user object
  # otherwise preload the article.
  def preload_content
    params[:article_id] ? :user : :article
  end

end
