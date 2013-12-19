class Api::V1::SessionsController < Devise::SessionsController
  prepend_before_filter :require_no_authentication, :only => [:create]

  respond_to :json

  def create
    warden.authenticate!(:scope => resource_name)
    render :status => 200,
           :json => { :user => current_user,
                      :auth_token => current_user.authentication_token }
  end

  def destroy
    warden.authenticate!(:scope => resource_name)
    current_user.update_column(:authentication_token, nil)
    render :status => 200,
           :json => {}
  end

end
