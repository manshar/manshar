object @user

attributes :id, :name, :created_at

attribute :avatar_abs_url => :avatar_url

node :thumb_url do |user|
  user.avatar_abs_url '400x400#'
end
