require 'spec_helper'


describe Api::V1::ConfirmationsController do

  before (:each) do
    @user = FactoryGirl.create(:unconfirmed_user)
    @token = @user.confirmation_token
    new_token = Devise.token_generator.digest(User, :confirmation_token, @token)
    @user.update_attribute(:confirmation_token, new_token)
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'get /confirm/:token' do
    it 'should register with JSON request and returns auth_token' do
      @user.confirmed_at.should eq(nil)
      get :show, :confirmation_token => @token
      response.should be_redirect
      response.should redirect_to('http://' + ENV['WEB_CLIENT_HOST'])
      @user.reload
      @user.confirmed_at.should_not eq(nil)
    end

    it 'should fail for invalid tokens' do
      @user.confirmed_at.should eq(nil)
      get :show, :confirmation_token => 'invalid-token'
      response.code.should eq('400')
      @user.confirmed_at.should eq(nil)
    end
  end

end
