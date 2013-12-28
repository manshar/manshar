class Api::V1::RegistrationsController < Devise::RegistrationsController
  prepend_before_filter :require_no_authentication, :only => [:create]
  
  respond_to :json

  def create
    build_resource(sign_up_params)
    # TODO Static confitmation
    resource.confirmed_at = Time.now
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
