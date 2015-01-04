class Api::V1::CommentsController < ApplicationController

  before_filter :authenticate_user!, except: [:index]
  before_filter :load_parent
  respond_to :json

  # GET /api/v1/articles/1/comments
  # GET /api/v1/articles/1/comments.json
  # GET /api/v1/users/1/comments
  # GET /api/v1/users/1/comments.json
  def index
    @comments = policy_scope(@parent.comments)
    render 'api/v1/comments/index'
  end

  # POST /api/v1/articles/1/comments
  # POST /api/v1/articles/1/comments.json
  def create
    @comment = current_user.comments.new(comment_params)
    @comment.article_id = params[:article_id]
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

  def comment_params
    params.require(:comment).permit(:body, :guid)
  end

end
