require 'spec_helper'

describe Api::V1::ImagesController, :type => :controller  do
  render_views

  before (:each) do
    @user = FactoryGirl.create(:user)
    @image = FactoryGirl.create(:image)
    @image_params = {
      :title => 'Title',
      :caption => 'caption',
      :asset => fixture_file_upload('images/test.png', 'image/png')
    }
  end

  describe 'GET images' do
    it 'should allow to view images' do
      auth_headers = @image.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      get :show, :id => @image.id
      response.should be_success
    end
  end

  describe 'POST images' do
    it 'should not allow to create images without authentication' do
      post :create, :image => @image_params
      response.code.should eq('401')
    end

    it 'should allow authenticated users to create images' do
      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      post :create, :image => @image_params

      response.should be_success
      parsed_response = JSON.parse(response.body)
      image = Image.find(parsed_response['id'])
      assert image.user
    end
  end

  describe 'PUT images/:id' do
    it 'should not allow unauthorized users to edit images' do
      put :update, { :id => @image.id, :image => @image_params }
      response.code.should eq('401')

      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      put :update, { :id => @image.id, :image => @image_params }
      response.code.should eq('401')
    end

    it 'should allow owners to edit their images' do
      auth_headers = @image.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      put :update, { :id => @image.id, :image => @image_params }
      response.should be_success
    end
  end

  describe 'DELETE images/:id' do
    it 'should not allow unauthorized users to delete images' do
      delete :destroy, :id => @image.id
      response.code.should eq('401')

      auth_headers = @user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :update, :id => @image.id
      response.code.should eq('401')
     end

    it 'should allow owners to delete their images' do
      auth_headers = @image.user.create_new_auth_token
      request.headers.merge!(auth_headers)
      delete :destroy, :id => @image.id
      response.should be_success
    end
  end

end
