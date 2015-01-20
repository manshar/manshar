module Utils
  extend ActiveSupport::Concern

  # Returns an absolute URL with the host and the passed url.
  # Example:
  #  url = abs_url '/images/example.png', 'manshar.me'
  #  url == '//manshar.me/images/example.png'
  def abs_url url, host
    uri = url
    if uri && uri !~ /^http/
      uri = "http://#{host}#{uri}"
    end
    uri
  end

  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods

    def abs_url_for *attributes
      attributes.each do |attr_name|
        define_method "#{attr_name}_abs_url" do |size = nil|

          image = self.send(attr_name)
          if image.nil?
            return
          end
          if size.nil?
            abs_url image.thumb(size).url, ENV['API_HOST']
          else
            abs_url image.url, ENV['API_HOST']
          end

        end
      end
    end

  end

end
