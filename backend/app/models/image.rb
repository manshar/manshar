class Image < ActiveRecord::Base

  dragonfly_accessor :asset do
    storage_options do |attachment|
      { headers: {"x-amz-acl" => "public-read-write"} }
    end
  end


  belongs_to :user

end
