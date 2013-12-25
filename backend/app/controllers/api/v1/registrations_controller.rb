class Api::V1::RegistrationsController < Devise::RegistrationsController

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

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :bio)
  end

end
