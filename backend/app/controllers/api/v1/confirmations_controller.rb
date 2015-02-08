class Api::V1::ConfirmationsController < DeviseTokenAuth::ConfirmationsController


  # TODO(mkhatib): Drop the whole controller once devise_token_auth gem
  # supports resending confirmation emails.
  def create
    unless resource_params[:email]
      return render json: {
        success: false,
        errors: ['You must provide an email address.']
      }, status: 400
    end

    unless params[:confirm_success_url]
      return render json: {
        success: false,
        errors: ['Missing redirect url.']
      }, status: 400
    end

    if resource_class.case_insensitive_keys.include?(:email)
      email = resource_params[:email].downcase
    else
      email = resource_params[:email]
    end

    q = "uid = ? AND provider='email'"

    # fix for mysql default case insensitivity
    if ActiveRecord::Base.connection.adapter_name.downcase.starts_with? 'mysql'
      q = "BINARY uid = ? AND provider='email'"
    end

    @resource = resource_class.where(q, email).first

    errors = nil

    if @resource
      @resource.send_confirmation_instructions({
        redirect_url: params[:confirm_success_url],
        client_config: params[:config_name]
      })
    else
      errors = ["Unable to find user with email '#{email}'."]
    end

    if errors
      render json: {
        success: false,
        errors: errors
      }, status: 400
    else
      render json: {
        status: 'success',
        data:   @resource.as_json
      }
    end

  end
end
