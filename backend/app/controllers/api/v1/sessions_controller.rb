class Api::V1::SessionsController < Devise::SessionsController

  skip_before_filter :authenticate_user_from_token!, :only => [:create]
  skip_after_filter :verify_authorized

  respond_to :json

  def create
    warden.authenticate!(:scope => resource_name)
    @user = current_user
    render 'api/v1/registrations/new'
  end

end
