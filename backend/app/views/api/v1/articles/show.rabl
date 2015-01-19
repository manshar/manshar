object @article

attributes :id, :title, :tagline, :created_at, :updated_at, :published_at,
  :published, :recommendations_count, :comments_count, :hotness, :reading_time

attribute :cover_abs_url => :original_cover_url

# Don't return cover for listings. We only need these when we are getting the
# full article. This might change in the future but for now this is causing
# a lot of queries to be executed when listing articles.
unless locals[:listing]

  attributes :body

  node :thumb_url do |article|
    article.cover_abs_url '400x400#'
  end

  node :cover_url do |article|
    article.cover_abs_url '1900x1200#'
  end

  node :card_cover_url do |article|
    article.cover_abs_url '1140x270#'
  end

  child @next => :next do
    extends('api/v1/articles/show', :locals => { :listing => true })
  end
end

child :user do
	extends('api/v1/users/show', :locals => { :listing => locals[:listing] })
end
