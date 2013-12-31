class Api::V1::RegistrationsController < Devise::RegistrationsController
  
  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    build_resource(sign_up_params)
    # TODO Static confitmation
    #resource.confirmed_at = Time.now
    if resource.save
      render :status => 200,
             :json => { :user => resource,
                        :authToken => resource.authentication_token }
    else
      render :status => 500,
             :json => { :errors => resource.errors }
    end
  end

  protected

  def after_inactive_sign_up_path_for(resource)
    # TODO (HammamSamara) move this env variable 
    redirect_to 'http://www.manshar.me/'
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :bio)
  end

end
