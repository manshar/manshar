object @article

attributes :id, :title, :tagline, :body, :created_at, :updated_at, :published

node :cover_url do |article|
  article.cover.url
end

child :user do
	extends 'api/v1/users/show'
end