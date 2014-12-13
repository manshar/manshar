class Api::V1::PasswordsController < Devise::PasswordsController

  respond_to :json

  skip_after_filter :verify_authorized
  skip_before_filter :authenticate_user!

  def create
    self.resource = resource_class.send_reset_password_instructions(
        resource_params)

    if successfully_sent?(resource)
      render :status => 200, :nothing => true
    else
      render :status => 500,
             :json => { :errors => resource.errors }
    end
  end

end
