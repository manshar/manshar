object @image

attributes :id, :created_at, :updated_at

attribute :asset_abs_url => :url

child :user do
  extends 'api/v1/users/show'
end
