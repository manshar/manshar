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


describe Api::V1::ConfirmationsController do

  it 'should route get /confirm/:token to confirmations#show' do
    expect(get '/api/v1/confirm/12r25awf2').
      to route_to({
        :controller => 'api/v1/confirmations',
        :action => 'show',
        :confirmation_token => '12r25awf2'
      })
  end

end
