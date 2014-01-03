class Api::V1::ConfirmationsController < Devise::ConfirmationsController

  skip_before_filter :authenticate_user_from_token!, :only => [:show]
  skip_after_filter :verify_authorized

  respond_to :json

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      sign_in(resource_name, resource)
      redirect_to('http://' + ENV['WEB_CLIENT_HOST'])
    else
      render :json => resource.errors, :status => :bad_request
    end
  end

end
