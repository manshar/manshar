Backend::Application.routes.draw do

  devise_for :users, :controllers => {
    :sessions => 'sessions',
    :registrations => 'registrations',
  }

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        match 'registrations' => 'registrations#create', :as => 'register', :via => [:post, :options]
        match 'sessions', :to => 'sessions#create', :as => 'login', :via => [:post, :options]
        match 'sessions', :to => 'sessions#destroy', :as => 'logout', :via => [:delete, :options]
      end
      # TODO(mkhatib): Remove this once we implement the articles resource.
      match 'articles/1', :to => 'articles#get', :via => [:get, :options]
      match 'articles/unsecure', :to => 'articles#unsecure', :via => [:get, :options]
    end
  end

  # TODO(mkhatib): Propably redirect the root to the web client website.
  root 'api/v1/articles#unsecure'
end
