class Image < ActiveRecord::Base
  include Utils

  belongs_to :user

  dragonfly_accessor :asset do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end
  abs_url_for :asset

end
