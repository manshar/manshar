class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::StrongParameters
  include Pundit

  # By default authenticate and authorize all requests. For actions that don't need
  # authentication or authorization use skip_before_filter :only and skip_after_filter
  # :only respectively to whitelist them.
  before_filter :authenticate_user!
  after_filter :verify_authorized

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found


  private

  def user_not_authorized
    render :nothing => true, :status => :unauthorized
  end

  def not_found
  	render :nothing => true, :status => :not_found
  end
end
