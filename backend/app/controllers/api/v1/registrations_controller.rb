class Api::V1::RegistrationsController < Devise::RegistrationsController

  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    build_resource(sign_up_params)
    if resource.save
      @user = resource
      render 'api/v1/registrations/new'
    else
      render :status => 500,
             :json => { :errors => resource.errors }
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(
        :email, :password, :name, :bio, :avatar)
  end

end
