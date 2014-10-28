require 'spec_helper'

describe Api::V1::UsersController do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
  end

  describe 'GET users' do
    it 'should return all users' do
      get :index
      response.should be_success
      rendered = Rabl.render(
          [@user], 'api/v1/users/index', :view_path => 'app/views')
      response.body.should eq(rendered)

      another_user = FactoryGirl.create(:user)

      get :index
      response.should be_success
      rendered = Rabl.render(
          [@user, another_user], 'api/v1/users/index', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

  describe 'GET users/:id' do
    it 'should return the user' do
      get :show, :id => @user.id
      response.should be_success
      rendered = Rabl.render(
          @user, 'api/v1/users/show', :view_path => 'app/views')
      response.body.should eq(rendered)
    end
  end

end

