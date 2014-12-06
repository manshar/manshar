object @article

attributes :id, :title, :tagline, :body, :created_at, :updated_at,
            :published, :recommendations_count


attribute :cover_abs_url => :original_cover_url

node :thumb_url do |article|
  article.cover_abs_url '400x400#'
end

node :cover_url do |article|
  article.cover_abs_url '1900x1200#'
end

node :card_cover_url do |article|
  article.cover_abs_url '1140x270#'
end

child :user do
	extends 'api/v1/users/show'
end
