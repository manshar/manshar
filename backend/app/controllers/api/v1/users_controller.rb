class Api::V1::UsersController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, except: [:index, :show]

  # GET /api/v1/users
  # GET /api/v1/users.json
  def index
    @users = User.top.publishers.page(params[:page])
    render 'api/v1/users/index'
  end

  # GET /api/v1/users/1
  # GET /api/v1/users/1.json
  def show
    @user = User.find(params[:id])
    render 'api/v1/users/show'
  end

  # PATCH/PUT /api/v1/users
  # PATCH/PUT /api/v1/users.json
  def update
    @user = current_user
    if @user.update(update_user_params)
      render 'api/v1/users/show'
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update_user_params
    params.require(:user).permit(:name, :bio, :avatar)
  end

end
