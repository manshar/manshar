Backend::Application.routes.draw do

  devise_for :users, :controllers => {
    :sessions => 'sessions',
    :registrations => 'registrations',
    :confirmations => 'confirmations',
    :passwords => "passwords",
  }

  concern :recommendable do
    resources :recommendations, :except => [:new, :edit, :show, :update, :delete]
  end

  concern :commentable do
    resources :comments, :except => [:new, :edit, :show, :update, :delete]
  end

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        match 'confirm/:confirmation_token', :to => 'confirmations#show', :as => 'user_confirm', :via => [:get]
        match 'registrations', :to => 'registrations#create', :as => 'register', :via => [:post, :options]
        match 'passwords', :to => 'passwords#create', :as => 'reset_password', :via => [:post, :options]
        match 'passwords', :to => 'passwords#update', :as => 'update_password', :via => [:put, :options]
        match 'sessions', :to => 'sessions#create', :as => 'login', :via => [:post, :options]
        match 'sessions', :to => 'sessions#destroy', :as => 'logout', :via => [:delete, :options]
      end

      resources :articles, concerns: [:recommendable, :commentable]
      resources :images
      resources :users, only: [:index, :show, :update]
      resources :categories, except: [:new, :edit]

      scope '/users/:user_id' do
        resources :recommendations, :only => [:index]
        resources :comments, :only => [:index]
        resources :articles, :only => [:index, :drafts], controller: 'users_articles'
      end

      scope '/me' do
        match 'drafts' => 'users_articles#drafts', via: [:get, :options]
        match 'articles' => 'users_articles#index', via: [:get, :options]
      end
    end
  end

  root 'api/v1/articles#index'
end
