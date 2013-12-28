require 'spec_helper'

describe Api::V1::ImagesController do

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
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      post :create, :image => @image_params
      parsed_response = JSON.parse(response.body)
      response.should be_success
      image = Image.find(parsed_response['id'])
      assert image.user
    end
  end

  describe 'PUT images/:id' do
    it 'should not allow unauthorized users to edit images' do
      put :update, { :id => @image.id, :image => @image_params }
      response.code.should eq('401')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      put :update, { :id => @image.id, :image => @image_params }
      response.code.should eq('401')
    end

    it 'should allow owners to edit their images' do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@image.user.authentication_token}"}
      put :update, { :id => @image.id, :image => @image_params }
      response.should be_success
    end
  end

  describe 'DELETE images/:id' do
    it 'should not allow unauthorized users to delete images' do
      delete :destroy, :id => @image.id
      response.code.should eq('401')

      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@user.authentication_token}"}
      delete :update, :id => @image.id
      response.code.should eq('401')
     end

    it 'should allow owners to delete their images' do
      request.env['HTTP_AUTHORIZATION'] = %Q{Token token="#{@image.user.authentication_token}"}
      delete :destroy, :id => @image.id
      response.should be_success
    end
  end

end
