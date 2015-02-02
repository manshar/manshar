object @topic

attributes :id, :title, :created_at, :updated_at, :articles_count

child :category do
  extends('api/v1/categories/show', :locals => { :listing => locals[:listing] })
end
