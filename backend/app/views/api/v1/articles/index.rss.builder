xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "منشر - منصة النشر العربية"
    #TODO (mjalajel) Add representative title/subtitle for the feed (POPULAR/LATEST/CATEGORY_NAME/TOPIC_NAME/USER_NAME)
    #xml.description ""
    xml.link request.url

    for article in @articles
      xml.item do
        xml.title article.title
        xml.description article.body
        xml.pubDate article.published_at.to_s(:rfc822)
        xml.link "http://#{ENV['WEB_CLIENT_HOST']}/articles/#{article.id}"
        xml.guid "http://#{ENV['WEB_CLIENT_HOST']}/articles/#{article.id}"
      end
    end
  end
end
