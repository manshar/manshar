object @article

attributes :id, :title, :tagline, :published_at,
   :recommendations_count, :comments_count, :reading_time, :published,
   :updated_at

# Don't return cover for listings. We only need these when we are getting the
# full article. This might change in the future but for now this is causing
# a lot of queries to be executed when listing articles.
if not locals[:listing]

  attributes :json_model, :created_at, :hotness

  # Only serve body when json_model is empty
  if not root_object.json_model
    attributes :body
  end

  attribute cover_abs_url: :original_cover_url

  node :thumb_url do |article|
    article.cover_abs_url '400x400#'
  end

  node :cover_url do |article|
    article.cover_abs_url '1900x1200#'
  end

  node :card_cover_url do |article|
    article.cover_abs_url '1140x270#'
  end

  child @next, :object_root => false do
    extends('api/v1/articles/index', :collection => @next)
  end

  child :user do
    extends('api/v1/users/show', locals: { listing: locals[:listing] })
  end

  child :topic do
    extends('api/v1/topics/show', locals: { listing: locals[:listing] })
  end

else
  node :user do |article|
    {
      id: article.user_id,
      name: article.user_name,
      thumb_url: article.user_avatar_url
    }
  end

  node :topic do |article|
    {
      id: article.topic_id,
      title: article.topic_title,
      category: {
        id: article.category_id,
        color: article.category_color
      }
    } if article.topic_title
  end
end
