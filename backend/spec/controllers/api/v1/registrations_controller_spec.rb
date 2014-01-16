require 'spec_helper'


describe Api::V1::RegistrationsController do

  before(:each) do
    @user = FactoryGirl.create(:user)
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'POST /registerations' do
    it 'should register with JSON request and returns auth_token' do
      post :create, { :user => {
          :email => 'tester@example.com',
          :password => 'tester123',
          :name => 'Example Tester',
          :avatar => fixture_file_upload('images/test.png', 'image/png'),
          :bio => "A tester who is an example in all tests." } }
      response.should be_success
      parsed_body = JSON.parse(response.body)

      assert parsed_body.has_key?('auth_token').should
      parsed_body['user']['email'].should eq('tester@example.com')

      user = User.find_by_email('tester@example.com')
      user.name.should eq('Example Tester')
      user.bio.should eq('A tester who is an example in all tests.')
    end

    it 'should fail for an already used email' do
      post :create, {:user => { :email => @user.email,
                                :password => 'tester123' } }
      response.status.should eq(500)

      parsed_body = JSON.parse(response.body)
      parsed_body.has_key?('errors').should eq(true)
    end
  end

end
