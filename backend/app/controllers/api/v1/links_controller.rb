class Api::V1::LinksController < ApplicationController

  before_action :authenticate_user!, except: [:index]
  after_action :verify_authorized, except: [:index]
  before_filter :load_parent
  respond_to :json


  # GET /api/v1/users/1/links
  # GET /api/v1/users/1/links.json
  def index
    @links = policy_scope(@parent.links)
    render 'api/v1/links/index'
  end

  # POST /api/v1/users/1/links
  # POST /api/v1/users/1/links.json
  def create
    @link = current_user.links.new(link_params)
    authorize @link
    if @link.save
      render 'api/v1/links/show', status: :created
    else
      render json: @link.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/users/1/links/1
  # PATCH/PUT /api/v1/users/1/links/1.json
  def update
    @link = Link.find(params[:id])
    authorize @link
    if @link.update(link_params)
      render 'api/v1/links/show'
    else
      render json: @link.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/1/links/1
  # DELETE /api/v1/users/1/links/1.json
  def destroy
    @link = Link.find(params[:id])
    authorize @link
    @link.destroy
    head :no_content
  end

  private
  def load_parent
    @parent =  User.find(params[:user_id])
  end

  def link_params
    params.require(:link).permit(:title, :url)
  end

end
