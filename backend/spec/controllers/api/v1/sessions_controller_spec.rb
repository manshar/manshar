require 'spec_helper'

describe Api::V1::SessionsController do
  render_views

  before(:each) do
    @user = FactoryGirl.create(:user)
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe 'POST "/sessions"' do
    it 'should authenticate a user with valid credentials' do
      post :create, user: { email: @user.email, password: @user.password }
      parsed_response = JSON.parse(response.body)

      response.should be_success
      parsed_response['user']['email'].should eq(@user.email)
      parsed_response['authToken'].should eq(@user.authentication_token)
    end

    it 'should not authenticate a user with invalid credentials' do
      post :create, user: { email: @user.email, password: 'wrongpassword'}
      parsed_response = JSON.parse(response.body)

      response.status.should eq(401)
      assert parsed_response.has_key?('errors')
      parsed_response['errors'].should eq('Unauthorized.')
    end
  end

end
