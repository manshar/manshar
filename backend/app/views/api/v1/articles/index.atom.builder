
atom_feed({:language => 'ar', 'xml:base' => "http://#{ENV['WEB_CLIENT_HOST']}" }) do |feed|
  feed.title("منشر - منصة النشر العربية")
  #TODO (mjalajel) Add representative title/subtitle for the feed (POPULAR/LATEST/CATEGORY_NAME/TOPIC_NAME/USER_NAME)
  #feed.subtitle("")
  feed.updated(@articles.first.created_at) if @articles.length > 0
  feed.icon('/images/manshar@64x64.png')

  feed.author do |author|
    author.name('منشر')
    author.uri('/')
  end

  @articles.each do |article|
    feed.entry(article, :url=> "/articles/#{article.id}") do |entry|
      entry.title(article.title)
      entry.summary(article.tagline)
      entry.content(article.body, type: 'html')

      entry.author do |author|
        author.name(article.user_name)
        author.uri("/profiles/#{article.user_id}")
      end
    end
  end
end
