class Api::V1::TopicsController < ApplicationController
  respond_to :json

  before_action :load_category, only: [:index, :create]
  before_action :authenticate_user!, except: [:index, :show]
  after_action :verify_authorized, except: [:index, :show]

  # GET /api/v1/category/1/topics
  # GET /api/v1/category/1/topics.json
  def index
    @topics = @category.topics.preload(:category)
    render 'api/v1/topics/index'
  end

  # GET /api/v1/category/1/topics/1
  # GET /api/v1/category/1/topics/1.json
  def show
    @topic = Topic.find(params[:id])
    render 'api/v1/topics/show'
  end

  # POST /api/v1/category/1/topics
  # POST /api/v1/category/1/topics.json
  def create
    @topic = @category.topics.new(topic_params)
    authorize @topic

    if @topic.save
      render 'api/v1/topics/show', status: :created
    else
      render json: @topic.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/category/1/topics/1
  # PATCH/PUT /api/v1/category/1/topics/1.json
  def update
    @topic = Topic.find(params[:id])
    authorize @topic

    if @topic.update(topic_params)
      render 'api/v1/topics/show', status: :success
    else
      render json: @topic.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/category/1/topics/1
  # DELETE /api/v1/category/1/topics/1.json
  def destroy
    @topic = Topic.find(params[:id])
    authorize @topic
    @topic.destroy

    head :no_content
  end

  private
  def load_category
    @category =  Category.find(params[:category_id])
  end

  def topic_params
    params.require(:topic).permit(:title)
  end

end
