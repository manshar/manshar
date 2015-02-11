require 'spec_helper'

describe Api::V1::RecommendationsController, :type => :controller  do
  render_views

  before :each do
    @user = FactoryGirl.create(:user)
    @article = FactoryGirl.create(:article)
    @article.published = true
    @article.save
    @recommendation = FactoryGirl.create(:recommendation)

    # counter_cache gets updated in the database directly so we need to
    # reload the article model.
    @recommendation.article.publish!
    @recommendation.article
    @recommendation.reload
  end

  describe "GET 'articles/:article_id/recommendations'" do
    it "should return all recommendations of an article" do
      get :index, :article_id => @article.id
      response.should be_success
      response.body.should eq([].to_json)

      get :index, :article_id => @recommendation.article_id
      response.should be_success
      @load_content = :user
      rendered = Rabl.render(
          [@recommendation], 'api/v1/recommendations/index', :view_path => 'app/views', scope: self)
      response.body.should eq(rendered)
    end
  end

  describe "GET 'users/:article_id/recommendations'" do
    it "should return all recommendations by the user" do
      get :index, :user_id => @user.id
      response.should be_success
      response.body.should eq([].to_json)

      get :index, :user_id => @recommendation.user_id
      response.should be_success
      @load_content = :article
      rendered = Rabl.render(
          [@recommendation], 'api/v1/recommendations/index', :view_path => 'app/views', scope: self)
      response.body.should eq(rendered)
    end
  end

  describe "POST 'articles/:article_id/recommendations'" do
    it "should error if the user already recommended the article" do
      auth_headers = @recommendation.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, :article_id => @recommendation.article_id
      response.code.should eq('422')
    end

    it "should create an article recommendation of the current user" do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, :article_id => @recommendation.article_id
      response.should be_success
      parsed_response = JSON.parse(response.body)
      recommendation = Recommendation.find(parsed_response['id'])
      rendered = Rabl.render(
          recommendation, 'api/v1/recommendations/show', :view_path => 'app/views')
    end

    it "should return 401 when the user is not logged in or unauthorized" do
      post :create, :article_id => @recommendation.article_id
      response.code.should eq('401')
    end
  end

  describe "DELETE 'articles/:article_id/recommendations/:id'" do

    it "should return 401 when the user is not logged in or unauthorized" do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :article_id => @recommendation.article_id, :id => @recommendation.id
      response.code.should eq('401')
    end

    it "should delete an article recommendation of the current user" do
      auth_headers = @recommendation.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :article_id => @recommendation.article_id, :id => @recommendation.id
      response.should be_success

      recommendation = Recommendation.find_by_id(@recommendation.id)
      assert recommendation.nil?
    end
  end

end
