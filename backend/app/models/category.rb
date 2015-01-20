class Category < ActiveRecord::Base
  include Utils

  # has_many :topics, :counter_cache => topics_count
  # has_many :articles, :through => :topics,
      # :counter_cache => :articles_count

  dragonfly_accessor :icon do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

  dragonfly_accessor :image do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end

  abs_url_for :icon, :image

end
