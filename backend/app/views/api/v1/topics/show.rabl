object @topic

attributes :id, :title

unless locals[:listing]
  attributes :created_at, :updated_at, :articles_count
end

child :category do
  extends('api/v1/categories/show', locals: { listing: locals[:listing] })
end
