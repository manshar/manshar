require 'spec_helper'

describe Api::V1::UsersArticlesController do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
    @article = FactoryGirl.create(:article)
    @another_article = FactoryGirl.create(:article)
    @published_article = FactoryGirl.create(:article)
    @published_article.publish!
  end

  describe 'GET users/:id/articles' do
    it 'should return all published articles for the user without authentication' do
      get :index, :user_id => @user.id
      response.should be_success
      response.body.should eq([].to_json)

      @article.publish!

      get :index, :user_id => @article.user.id
      response.should be_success
      rendered = Rabl.render(
          [@article], 'api/v1/articles/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'GET me/articles' do
    it 'should return all published articles for the current user' do
      get :index
      response.code.should eq('404')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@article.user.authentication_token}"}
      get :index
      response.should be_success
      response.body.should eq([].to_json)

      @article.publish!

      get :index
      response.should be_success
      rendered = Rabl.render(
          [@article], 'api/v1/articles/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'GET me/drafts' do
    it 'should return all drafts for the current user' do
      get :drafts
      response.code.should eq('401')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      get :drafts
      response.should be_success
      response.body.should eq([].to_json)
    end

    it 'should return all drafts for the current user' do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@article.user.authentication_token}"}
      get :drafts
      response.should be_success
      rendered = Rabl.render(
          [@article], 'api/v1/articles/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end
end
