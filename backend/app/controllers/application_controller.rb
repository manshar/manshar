class ApplicationController < ActionController::Base
  include Pundit
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :configure_permitted_parameters, if: :devise_controller?

  respond_to :json
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

    def user_not_authorized
      render nothing: true, status: :unauthorized
    end

    def not_found
    	render nothing: true, status: :not_found
    end

    def configure_permitted_parameters
      [:bio, :avatar, :name].each do |attribute|
        devise_parameter_sanitizer.for(:sign_up) << attribute
        devise_parameter_sanitizer.for(:account_update) << attribute
      end
    end

end
