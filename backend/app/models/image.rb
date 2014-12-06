class Image < ActiveRecord::Base
  include Concerns::Utils

  dragonfly_accessor :asset do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end


  belongs_to :user


  def asset_abs_url size = nil
    if size
      abs_url asset.thumb(size).url, ENV['API_HOST']
    else
      abs_url asset.url, ENV['API_HOST']
    end
  end

end
