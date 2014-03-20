class Api::V1::SessionsController < Devise::SessionsController

  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    warden.authenticate!(:scope => resource_name)
    @user = current_user
    render 'api/v1/registrations/new'
  end

  def destroy
    warden.authenticate!(:scope => resource_name)
    current_user.update_column(:authentication_token, nil)
    render :status => 200,
           :json => {}
  end

end
