class AddReadingTimeToArticle < ActiveRecord::Migration
  def change
    add_column :articles, :reading_time, :integer

    Article.find_each do |article|
      time = (article.body.split.size / 200.0).ceil
      if article.reading_time.nil?
        article.reading_time = time
        article.save!
      end
    end

  end
end
