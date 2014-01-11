module Utils
  extend ActiveSupport::Concern

  def abs_url url, host
    uri = url
    if uri && uri !~ /^http/
      uri = "//#{host}#{uri}"
    end
    uri
  end

end
