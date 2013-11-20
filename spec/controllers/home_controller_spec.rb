require 'spec_helper'

describe HomeController do
  describe 'index' do
    it 'does not redirect' do
      get :index
      expect(response).to_not be_redirect
    end

    it 'renders the index template' do
      get :index
      expect(response).to render_template('index')
    end
  end
end