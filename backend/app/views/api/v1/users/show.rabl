object @user

attributes :id, :name, :created_at

node :avatar_url do |user|
  user.avatar.url
end