class Api::V1::PasswordsController < DeviseTokenAuth::PasswordsController
  before_filter :set_user_by_token, :only => [:update]

  # TODO(mkhatib): The only change here is to allow resource with a non-email
  # provider to change their passwords.
  def update
    # make sure user is authorized
    unless @resource
      return render json: {
        success: false,
        errors: ['Unauthorized']
      }, status: 401
    end

    # ensure that password params were sent
    unless password_resource_params[:password] and password_resource_params[:password_confirmation]
      return render json: {
        success: false,
        errors: ['You must fill out the fields labeled "password" and "password confirmation".']
      }, status: 422
    end

    if @resource.update_attributes(password_resource_params)
      return render json: {
        success: true,
        data: {
          user: @resource,
          message: "Your password has been successfully updated."
        }
      }
    else
      return render json: {
        success: false,
        errors: @resource.errors
      }, status: 422
    end
  end

end
