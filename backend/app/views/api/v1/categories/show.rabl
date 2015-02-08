object @category

attributes :id, :title, :description, :color, :icon_cssclass,
    :created_at, :updated_at, :articles_count, :topics_count

node :image_thumb_url do |category|
  category.image_abs_url '300x300#'
end

attribute :image_abs_url => :original_image_url

node :icon_url do |category|
  category.icon_abs_url '32x32#'
end
