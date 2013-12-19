require 'spec_helper'

describe Api::V1::SessionsController do

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
      parsed_response['auth_token'].should eq(@user.authentication_token)
    end

    it 'should not authenticate a user with invalid credentials' do
      post :create, user: { email: @user.email, password: 'wrongpassword'}
      parsed_response = JSON.parse(response.body)

      response.status.should eq(401)
      assert parsed_response.has_key?('errors')
      parsed_response['errors'].should eq('Unauthorized.')
    end
  end

  describe 'DELETE "/sessions"' do
    it 'should logout users with valid credentials' do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      delete :destroy
      parsed_response = JSON.parse(response.body)

      response.should be_success
      parsed_response.should be_empty
    end

    it 'should fail with invalid credentials' do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="invalid-token"}
      delete :destroy
      parsed_response = JSON.parse(response.body)

      response.status.should eq(401)
      assert parsed_response.has_key?('errors')
      parsed_response['errors'].should eq('Unauthorized.')
    end
  end

end
