object @article

attributes :id, :title, :tagline, :body, :created_at, :updated_at, :published

child :user do
	extends 'api/v1/users/show'
end
