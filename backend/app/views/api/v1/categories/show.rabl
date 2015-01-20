object @category

attributes :id, :title, :description, :created_at, :updated_at,
    :articles_count, :topics_count

node :image_url do |category|
  category.image_abs_url '1900x700#'
end

node :icon_url do |category|
  category.icon_abs_url '32x32#'
end
