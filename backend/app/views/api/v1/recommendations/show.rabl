object @recommendation

attributes :id, :created_at, :updated_at

child :user do
  extends('api/v1/users/show', :locals => { :listing => locals[:listing] })
end

child :article do
  extends("api/v1/articles/show", :locals => { :listing => locals[:listing] })
end
