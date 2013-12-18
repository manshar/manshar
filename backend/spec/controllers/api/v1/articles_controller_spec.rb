require 'spec_helper'

describe Api::V1::ArticlesController do

  before (:each) do
    @user = FactoryGirl.create(:user)
  end

  describe 'GET "articles/unsecure"' do
    it "should require no authentication" do
      get :unsecure
      response.should be_success
    end
  end

  describe 'GET articles/1' do
    it "should require authentication" do
      get :get, :id => '1'
      response.code.should eq('401')
      response.body.should eq({'errors' => 'Unauthorized.'}.to_json)

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      get :get, {:id => '1'}
      response.should be_success
      response.body.should eq({'title' => 'Super Secure Stuff.'}.to_json)
    end
  end
end
