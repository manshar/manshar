require 'spec_helper'

describe Api::V1::SessionsController do

  it 'should route POST /sessions to sessions#create' do
    expect(post '/api/v1/sessions').
      to route_to('api/v1/sessions#create')
  end

  it 'should route DELETE /sessions to sessions#destroy' do
    expect(delete '/api/v1/sessions').
      to route_to('api/v1/sessions#destroy')
  end

end


describe Api::V1::RegistrationsController do

  it 'should route POST /registrations to registrations#create' do
    expect(post '/api/v1/registrations').
      to route_to('api/v1/registrations#create')
  end

end
