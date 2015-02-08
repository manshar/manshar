class Api::V1::ImagesController < ApplicationController

  after_action :verify_authorized
  before_action :authenticate_user!
  respond_to :json

  def show
    @image = Image.find(params[:id])
    authorize @image
    render 'api/v1/images/show'
  end

  def create
    @image = current_user.images.new(image_params)
    authorize @image
    if @image.save
      render 'api/v1/images/show', status: :created
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end

  def update
    @image = Image.find(params[:id])
    authorize @image
    if @image.update(image_params)
      render 'api/v1/images/show'
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @image = Image.find(params[:id])
    authorize @image
    @image.destroy
    head :no_content
  end


  private

  def image_params
    params.require(:image).permit(:title, :caption, :asset)
  end

end
