class Api::V1::CategoriesController < ApplicationController

  before_action :authenticate_user!, except: [:index, :show]
  after_action :verify_authorized, except: [:index, :show]
  respond_to :json

  # GET /api/v1/categories
  # GET /api/v1/categories.json
  def index
    @categories = Category.all
    @all = params[:all]
    render 'api/v1/categories/index'
  end

  # GET /api/v1/categories/1
  # GET /api/v1/categories/1.json
  def show
    @category = Category.find(params[:id])
    render 'api/v1/categories/show'
  end

  # POST /api/v1/categories
  # POST /api/v1/categories.json
  def create
    @category = Category.new(category_params)
    authorize @category
    if @category.save
      render 'api/v1/categories/show', status: :created
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/categories/1
  # PATCH/PUT /api/v1/categories/1.json
  def update
    @category = Category.find(params[:id])
    authorize @category
    if @category.update(category_params)
      render 'api/v1/categories/show'
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/categories/1
  # DELETE /api/v1/categories/1.json
  def destroy
    @category = Category.find(params[:id])
    authorize @category
    @category.destroy

    head :no_content
  end

  def category_params
    params.require(:category).permit(
        :title, :description, :color, :icon_cssclass, :image, :icon)
  end

end
