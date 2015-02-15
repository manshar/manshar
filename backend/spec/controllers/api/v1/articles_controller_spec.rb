require 'spec_helper'

describe Api::V1::ArticlesController, :type => :controller do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
    @article = FactoryGirl.create(:article)
  end

  describe 'GET articles' do
    it 'should return all published articles without authentication' do
      get :index, format: :json
      response.should be_success
      response.body.should eq([].to_json)

      @article.publish!
      @article.reload

      get :index, format: :json
      response.should be_success
      rendered = Rabl.render(
          [@article], 'api/v1/articles/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'GET articles/:id' do
    it 'should return 401 for accessing other users unpublished article' do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      get :show, :id => @article.id, format: :json
      response.code.should eq('401')
    end

    it 'should allow users to access their drafts' do
      auth_headers = @article.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      get :show, :id => @article.id, format: :json
      response.code.should eq('200')
      rendered = Rabl.render(
          @article, 'api/v1/articles/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end

    it 'should allow users to access published articles without authentication' do
      @article.publish!
      @article.reload

      get :show, :id => @article.id, format: :json
      response.should be_success
      rendered = Rabl.render(
          @article, 'api/v1/articles/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'POST articles' do
    it 'should 401 for unauthorized user' do
      post :create, :article => {
          :title => 'Hello There', :tagline => 'My awesome tagline',
          :cover => fixture_file_upload('images/test.png', 'image/png'),
          :body => 'What is going on?' }
      response.code.should eq('401')
    end

    it 'should create a draft article by default for authorized user' do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, { :article => {
        :title => 'Hello There', :tagline => 'My awesome tagline',
        :cover => fixture_file_upload('images/test.png', 'image/png'),
        :body => 'What is going on?' } }
      response.should be_success
      parsed_response = JSON.parse(response.body)
      article = Article.find(parsed_response['id'])
      article.title.should eq('Hello There')
      article.tagline.should eq('My awesome tagline')
      article.body.should eq('What is going on?')
      article.published.should eq(false)
    end

    it 'should publish a new article if specified' do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, { :article => {
          :title => 'Hello There', :tagline => 'My awesome tagline',
          :body => 'What is going on?', :published => true,
          :cover => fixture_file_upload('images/test.png', 'image/png') } }
      response.should be_success
      parsed_response = JSON.parse(response.body)
      article = Article.find(parsed_response['id'])
      article.published.should eq(true)
    end
  end

  describe 'PUT articles/:id' do
    it 'should 401 for unauthorized update' do
      put :update, { :id => @article.id, :article => { :title => 'My New Title' } }
      response.code.should eq('401')

      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      put :update, { :id => @article.id, :article => { :title => 'My New Title' } }
      response.code.should eq('401')
    end

    it 'should update successfully for owners' do
      auth_headers = @article.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      put :update, { :id => @article.id, :article => { :title => 'My New Title' } }
      response.should be_success
      parsed_response = JSON.parse(response.body)
      article = Article.find(parsed_response['id'])
      rendered = Rabl.render(
          article, 'api/v1/articles/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'DELETE articles/:id' do
    it 'should 401 for unauthorized delete' do
      delete :destroy, { :id => @article.id }
      response.code.should eq('401')

      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, { :id => @article.id }
      response.code.should eq('401')
    end

    it 'should delete successfully for owners' do
      auth_headers = @article.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, { :id => @article.id }
      response.should be_success
      article = Article.find_by_id(@article.id)
      assert article.nil?
    end
  end
end
