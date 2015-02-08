require 'spec_helper'

describe Api::V1::UsersController, :type => :controller  do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
  end

  describe 'GET users' do
    it 'should return only publishers' do
      get :index, format: :json
      response.should be_success
      rendered = Rabl.render(
          [], 'api/v1/users/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'GET users/:id' do
    it 'should return the user' do
      get :show, :id => @user.id, format: :json
      response.should be_success
      rendered = Rabl.render(
          @user, 'api/v1/users/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

end

