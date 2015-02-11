require 'spec_helper'

describe Api::V1::CommentsController, :type => :controller  do
  render_views

  before :each do
    @user = FactoryGirl.create(:user)
    @article = FactoryGirl.create(:article)
    @article.published = true
    @article.save
    @article.reload
    @comment = FactoryGirl.create(:comment)

    @comment_params = {
      :comment => {
        :body => 'Hello There',
        :guid => '8df524ef-a45a-4140-bfc5-7feef3e6b292'
      },
      :article_id => @article.id
    }
    # counter_cache gets updated in the database directly so we need to
    # reload the article model.
    @comment.article.publish!
    @comment.reload
  end

  describe "GET 'articles/:article_id/comments'" do
    it "should return all comments of an article" do
      get :index, :article_id => @article.id
      response.should be_success
      response.body.should eq([].to_json)

      get :index, :article_id => @comment.article_id
      response.should be_success
      @load_content = :user
      rendered = Rabl.render(
          [@comment], 'api/v1/comments/index', :view_path => 'app/views', scope: self)
      response.body.should eq(rendered)
    end
  end

  describe "GET 'users/:article_id/comments'" do
    it "should return all comments by the user" do
      get :index, :user_id => @user.id
      response.should be_success
      response.body.should eq([].to_json)

      get :index, :user_id => @comment.user_id
      response.should be_success
      @load_content = :article
      rendered = Rabl.render(
          [@comment], 'api/v1/comments/index', :view_path => 'app/views', scope: self)
      response.body.should eq(rendered)
    end
  end

  describe "POST 'articles/:article_id/comments'" do
    it "should create an article comment of the current user" do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, @comment_params
      response.should be_success
      parsed_response = JSON.parse(response.body)
      comment = Comment.find(parsed_response['id'])
      rendered = Rabl.render(
          comment, 'api/v1/comments/show', :view_path => 'app/views')
    end

    it "should return 401 when the user is not logged in or unauthorized" do
      post :create, :article_id => @comment.article_id
      response.code.should eq('401')
    end
  end

  describe "DELETE 'articles/:article_id/comments/:id'" do

    it "should return 401 when the user is not logged in or unauthorized" do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :article_id => @comment.article_id, :id => @comment.id
      response.code.should eq('401')
    end

    it "should delete an article comment of the current user" do
      auth_headers = @comment.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :article_id => @comment.article_id, :id => @comment.id
      response.should be_success

      comment = Comment.find_by_id(@comment.id)
      assert comment.nil?
    end
  end

end
