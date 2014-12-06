module Concerns::Utils
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

end
