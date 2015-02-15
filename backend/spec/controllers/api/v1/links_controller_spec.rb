require 'spec_helper'

describe Api::V1::LinksController, :type => :controller do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
    @link = FactoryGirl.create(:link)
    @link_params = {
      :link => {
        :title => 'Manshar',
        :url => 'http://www.manshar.com'
      },
      :user_id => @user.id
    }
  end

  describe "GET 'users/:user_id/links'" do
    it "should return all links of a user" do
      get :index, :user_id => @user.id
      response.should be_success
    end
  end

  describe "POST 'users/:user_id/links'" do
    it "should not allow users to create links without authentication" do
      post :create, :link => @link_params
      response.code.should eq('401')
    end

    it "should create a link for the current authenticated user" do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, @link_params
      response.should be_success
      parsed_response = JSON.parse(response.body)
      link = Link.find(parsed_response['id'])
      rendered = Rabl.render(
          link, 'api/v1/links/show', :view_path => 'app/views')
    end
  end

  describe "PUT 'users/:user_id/links/:id'" do
    it 'should return 401 when the user is not logged in or unauthorized' do
      put :update, { :id => @link.id, :link => { :title => 'New Title' } }
      response.code.should eq('401')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      put :update, :user_id => @link.user_id, :id => @link.id, :link => { :title => 'New Title' }
      response.code.should eq('401')
    end

    it 'should update successfully for owners' do
      auth_headers = @link.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      put :update, :user_id => @link.user_id, :id => @link.id, :link => { :title => 'New Title' }
      response.should be_success
      parsed_response = JSON.parse(response.body)
      link = Link.find(parsed_response['id'])
      rendered = Rabl.render(
          link, 'api/v1/links/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end


  describe "DELETE 'users/:user_id/links/:id'" do
    it "should return 401 when the user is not logged in or unauthorized" do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      delete :destroy, :user_id => @link.user_id, :id => @link.id
      response.code.should eq('401')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      delete :destroy, :user_id => @link.user_id, :id => @link.id
      response.code.should eq('401')
    end

    it "should delete a link of the current authenticated user" do
      auth_headers = @link.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :user_id => @link.user_id, :id => @link.id
      response.should be_success

      link = Link.find_by_id(@link.id)
      assert link.nil?
    end
  end


end
