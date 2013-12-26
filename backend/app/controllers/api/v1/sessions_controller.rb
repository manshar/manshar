class Api::V1::SessionsController < Devise::SessionsController

  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    warden.authenticate!(:scope => resource_name)
    render :status => 200,
           :json => { :user => current_user,
                      :authToken => current_user.authentication_token }
  end

  def destroy
    warden.authenticate!(:scope => resource_name)
    current_user.update_column(:authentication_token, nil)
    render :status => 200,
           :json => {}
  end

end
