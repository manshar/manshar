require 'spec_helper'

describe Article do

  before (:each) do
    @article = FactoryGirl.create(:article)
    @unpublished_article = FactoryGirl.create(:article)
  end

	describe 'Article.public' do
	  it 'should return all public articles' do
      Article.public.load.should eq([])
      @article.publish!
	  	Article.public.load.should =~ [@article]
	  end
	end

  describe 'Article.drafts' do
    it 'should return all draft articles' do
      Article.drafts.load.should =~ [@article, @unpublished_article]
      @article.publish!
      Article.drafts.load.should =~ [@unpublished_article]
      @unpublished_article.publish!
      Article.drafts.load.should =~ []
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
