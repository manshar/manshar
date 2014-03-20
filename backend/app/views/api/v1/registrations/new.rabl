object @user

child @user do
  extends 'api/v1/users/show'

  attributes :email, :updated_at
end

attribute :authentication_token => :authToken
