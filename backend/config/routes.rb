Rails.application.routes.draw do

  scope defaults: { format: :json } do
    devise_for :users, controllers: {
      sessions: 'sessions',
      registrations: 'registrations',
      confirmations: 'confirmations',
    }

    concern :recommendable do
      resources :recommendations, except: [:new, :edit, :show, :update, :delete]
    end

    namespace :api do
      namespace :v1 do
        devise_scope :user do
          match 'confirm/:confirmation_token', to: 'confirmations#show', as: 'user_confirm', via: [:get]
          match 'registrations', to: 'registrations#create', as: 'register', via: [:post, :options]
          match 'sessions', to: 'sessions#create', as: 'login', via: [:post, :options]
          match 'sessions', to: 'sessions#destroy', as: 'logout', via: [:delete, :options]
        end

        resources :articles, concerns: :recommendable
        resources :images
        resources :users, only: [:index, :show]

        scope '/users/:user_id' do
          resources :recommendations, only: [:index]
          resources :articles, only: [:index, :drafts], controller: 'users_articles'
        end

        scope '/me' do
          match :drafts, to: 'users_articles#drafts', via: [:get, :options]
          match :articles, to: 'users_articles#index', via: [:get, :options]
        end
      end
    end

    root 'api/v1/articles#index'
  end

end
