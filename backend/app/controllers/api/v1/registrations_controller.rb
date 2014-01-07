class Api::V1::RegistrationsController < Devise::RegistrationsController

  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    build_resource(sign_up_params)
    if resource.save
      render :status => 200,
             :json => { :user => resource,
                        :authToken => resource.authentication_token }
    else
      render :status => 500,
             :json => { :errors => resource.errors }
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(
        :email, :password, :password_confirmation, :name, :bio, :avatar)
  end

end
