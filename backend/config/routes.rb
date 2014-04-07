Backend::Application.routes.draw do

  devise_for :users, :controllers => {
    :sessions => 'sessions',
    :registrations => 'registrations',
    :confirmations => 'confirmations',
  }

  concern :recommendable do
    resources :recommendations, :except => [:new, :edit, :show, :update]
  end

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        match 'confirm/:confirmation_token', :to => 'confirmations#show', :as => 'user_confirm', :via => [:get]
        match 'registrations', :to => 'registrations#create', :as => 'register', :via => [:post, :options]
        match 'sessions', :to => 'sessions#create', :as => 'login', :via => [:post, :options]
        match 'sessions', :to => 'sessions#destroy', :as => 'logout', :via => [:delete, :options]
      end

      scope '/users/:user_id' do
        resources :recommendations, :only => [:index]
      end

      resources :articles, concerns: :recommendable
      resources :images
    end
  end

  root 'api/v1/articles#index'
end
