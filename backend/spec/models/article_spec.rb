require 'spec_helper'

describe Article do

  before (:each) do
    @article = FactoryGirl.create(:article)
    @unpublished_article = FactoryGirl.create(:article)
  end

	describe 'Article.published' do
	  it 'should return all published articles' do
      Article.publishings.load.should eq([])
      @article.publish!
	  	Article.publishings.load.should =~ [@article]
	  end
	end

	describe 'Article.publish!' do
	  it 'should mark the article as published' do
	  	@unpublished_article.published.should eq(false)
	  	@unpublished_article.publish!
	  	@unpublished_article.published.should eq(true)
	  end
	end

	describe 'Article.draft?' do
	  it 'should return true if the article is draft' do
	  	@unpublished_article.draft?.should eq(true)
	  	@unpublished_article.publish!
	  	@unpublished_article.draft?.should eq(false)
	  end
	end

end
