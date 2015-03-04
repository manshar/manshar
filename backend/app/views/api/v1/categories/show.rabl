object @category

attributes :id, :title, :color, :icon_cssclass

unless locals[:listing]

  attributes :created_at, :updated_at, :articles_count, :topics_count,
      :description

  attribute :image_abs_url => :original_image_url

  node :image_thumb_url do |category|
    category.image_abs_url '80x80#'
  end

  node :icon_url do |category|
    category.icon_abs_url '32x32#'
  end

end
