require 'spec_helper'

describe 'routes for Home' do
  it "routes / to the home controller" do
    expect(get('/')).
      to route_to('home#index')
  end
end
