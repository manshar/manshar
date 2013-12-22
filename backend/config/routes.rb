Backend::Application.routes.draw do

  devise_for :users, :controllers => {
    :sessions => 'sessions',
    :registrations => 'registrations',
  }

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        post 'registrations' => 'registrations#create', :as => 'register'
        match 'sessions', :via => [:options]
        post 'sessions' => 'sessions#create', :as => 'login'
        delete 'sessions' => 'sessions#destroy', :as => 'logout'
      end
      # TODO(mkhatib): Remove this once we implement the articles resource.
      get 'articles/1' => 'articles#get', :via => [:get, :options]
      get 'articles/unsecure' => 'articles#unsecure'
    end
  end

  # TODO(mkhatib): Propably redirect the root to the web client website.
  root 'articles#unsecure'
end
