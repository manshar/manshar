object @article

attributes :id, :title, :tagline, :body, :created_at, :updated_at, :published


attribute :cover_abs_url => :cover_url

node :thumb_url do |article|
  article.cover_abs_url '400x400#'
end

child :user do
	extends 'api/v1/users/show'
end
