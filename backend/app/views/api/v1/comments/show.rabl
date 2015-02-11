object @comment

attributes :id, :guid, :body, :created_at, :updated_at

# Don't render the user object when listing user comments.
if @load_content == :user
  child :user do
    extends("api/v1/users/show", :locals => { :listing => locals[:listing] })
  end
end

# Don't render the article object when listing article comments.
if @load_content == :article
  child :article do
    extends("api/v1/articles/show", :locals => { :listing => locals[:listing] })
  end
end
