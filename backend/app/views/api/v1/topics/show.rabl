object @topic

attributes :id, :title, :articles_count

unless locals[:listing]
  attributes :created_at, :updated_at
end

child :category do
  extends('api/v1/categories/show', locals: { listing: locals[:listing] })
end
