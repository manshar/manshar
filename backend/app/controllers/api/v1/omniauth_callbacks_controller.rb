class Api::V1::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
  respond_to :json, :html
  rescue_from ActiveRecord::RecordNotUnique, with: :user_exists_with_other_providers

  # TODO(mkhatib): This wouldn't be necessary if Facebook omniauth config worked.
  def get_large_image image_url
    url = URI.parse(image_url)
    if url.host == 'graph.facebook.com'
      return image_url + '?width=1200&height=900'
    else
      return image_url
    end
  end

  # Override this to set image attribute properly.
  # devise_token_auth uses 'image' for the attribute name.
  def assign_provider_attrs(user, auth_hash)
    user.assign_attributes({
      nickname: auth_hash['info']['nickname'],
      name: auth_hash['info']['name'],
      avatar_url: get_large_image(auth_hash['info']['image']),
      email: auth_hash['info']['email']
    })
  end

  # RecordNotUnique is thrown when the email has already been used with another
  # provider, sign that user in since we know the user own the email through
  # their provider.
  def user_exists_with_other_providers
    @resource = User.find_by_email(@resource.email)

    @resource.tokens[@client_id] = {
      token: BCrypt::Password.create(@token),
      expiry: @expiry
    }

    if resource_class.devise_modules.include?(:confirmable)
      @resource.skip_confirmation!
    end

    if @resource.avatar_uid.nil?
      @resource.avatar_url = get_large_image(auth_hash['info']['image'])
    end
    if @resource.nickname.nil?
      @resource.nickname = auth_hash['info']['nickname']
    end

    sign_in(:user, @resource, store: false, bypass: false)
    @resource.save!

    render :layout => "layouts/omniauth_response", :template => "devise_token_auth/omniauth_success"
  end
end
