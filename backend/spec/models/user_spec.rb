require 'spec_helper'

describe User do

	before (:each) do
		@user = FactoryGirl.create(:user)
		@article = FactoryGirl.build(:article)
		@user.articles << @article
	end

  describe 'User.drafts' do
  	it 'should return all user drafts' do
  		@user.drafts.load.should eq([@article])
  		@article.publish!
  		@user.drafts.load.should eq([])
  	end
  end

  describe 'User.published_articles' do
  	it 'should return all user published articles' do
  		@user.published_articles.load.should eq([])
  		@article.publish!
  		@user.published_articles.load.should eq([@article])
  	end
  end

end
