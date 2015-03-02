class Api::V1::SessionsController < DeviseTokenAuth::SessionsController

  # TODO(mkhatib): The only change is to drop the "AND provider='email'" clause
  # in the initial query for the resource. This is in order to allow non-email
  # providers to login using their email and a later set password.
  def create
    # Check
    field = (resource_params.keys.map(&:to_sym) & resource_class.authentication_keys).first

    @resource = nil
    if field
      q_value = resource_params[field]

      if resource_class.case_insensitive_keys.include?(field)
        q_value.downcase!
      end

      q = "#{field.to_s} = ?"

      if ActiveRecord::Base.connection.adapter_name.downcase.starts_with? 'mysql'
        q = "BINARY " + q
      end

      @resource = resource_class.where(q, q_value).first
    end

    if @resource and valid_params?(field, q_value) and @resource.valid_password?(resource_params[:password]) and @resource.confirmed?
      # create client id
      @client_id = SecureRandom.urlsafe_base64(nil, false)
      @token     = SecureRandom.urlsafe_base64(nil, false)

      @resource.tokens[@client_id] = {
        token: BCrypt::Password.create(@token),
        expiry: (Time.now + DeviseTokenAuth.token_lifespan).to_i
      }
      @resource.save

      sign_in(:user, @resource, store: false, bypass: false)

      render json: {
        data: @resource.as_json(except: [
          :tokens, :created_at, :updated_at
        ])
      }

    elsif @resource and not @resource.confirmed?
      render json: {
        success: false,
        errors: [
          "A confirmation email was sent to your account at #{@resource.email}. "+
          "You must follow the instructions in the email before your account "+
          "can be activated"
        ]
      }, status: 401

    else
      render json: {
        errors: ["Invalid login credentials. Please try again."]
      }, status: 401
    end
  end

  def valid_params?(key, val)
    resource_params[:password] && key && val
  end

end
