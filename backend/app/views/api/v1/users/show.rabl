object @user

attributes :id, :name, :bio, :created_at, :admin, :staff,
  :published_articles_count, :comments_count, :recommendations_count

# Don't return cover for listings. We only need these when we are getting the
# full article. This might change in the future but for now this is causing
# a lot of queries to be executed when listing articles.
unless locals[:listing]

  attribute :avatar_abs_url => :avatar_url

  node :cover_url do |user|
    user.avatar_abs_url '1900x1200#'
  end

  node :thumb_url do |user|
    user.avatar_abs_url '400x400#'
  end

end
