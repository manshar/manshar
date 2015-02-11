object @recommendation

attributes :id, :created_at, :updated_at

# Don't render the user object when listing user recommendations.
if @load_content == :user
  child :user do
    extends('api/v1/users/show', :locals => { :listing => locals[:listing] })
  end
end

# Don't render the article object when listing article recommendations.
if @load_content == :article
  child :article do
    extends("api/v1/articles/show", :locals => { :listing => locals[:listing] })
  end
end
