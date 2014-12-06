require 'spec_helper'

describe Api::V1::ArticlesController do

  it 'should route GET /articles to articles#index' do
    expect(get '/api/v1/articles').
      to route_to('api/v1/articles#index', format: :json)
  end

  it 'should route GET /articles/:id to articles#show' do
    expect(get '/api/v1/articles/1').to route_to(
        :controller => "api/v1/articles", :action => "show", :id => "1", format: :json)
  end

  it 'should route POST /articles to articles#create' do
    expect(post '/api/v1/articles').
      to route_to('api/v1/articles#create', format: :json)
  end

  it 'should route PUT /articles/:id to articles#update' do
    expect(put '/api/v1/articles/1').to route_to(
        :controller => "api/v1/articles", :action => "update", :id => "1", format: :json)
  end

  it 'should route DELETE /articles/:id to articles#destroy' do
    expect(delete '/api/v1/articles/1').to route_to(
        :controller => "api/v1/articles", :action => "destroy", :id => "1", format: :json)
  end

end
