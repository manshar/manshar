Rails.application.routes.draw do

  scope do
    mount_devise_token_auth_for 'User', at: '/auth', controllers: {
      sessions:  'api/v1/sessions',
      confirmations:  'api/v1/confirmations',
      passwords:  'api/v1/passwords',
      omniauth_callbacks:  'api/v1/omniauth_callbacks'
    }

    concern :recommendable do
      resources :recommendations, except: [:new, :edit, :show, :update, :delete]
    end

    concern :commentable do
      resources :comments, :except => [:new, :edit, :show, :update, :delete]
    end

    namespace :api do
      namespace :v1 do

        resources :articles, concerns: [:recommendable, :commentable]
        resources :images
        resources :users, only: [:index, :show, :update]
        resources :links, except: [:show]

        resources :categories, except: [:new, :edit] do
          resources :articles, only: [:index]

          resources :topics, excpet: [:new, :edit] do
            resources :articles, only: [:index]
          end
        end


        scope '/users/:user_id' do
          resources :recommendations, :only => [:index]
          resources :comments, :only => [:index]
          resources :links, :only => [:index]
          resources :articles, :only => [:index, :drafts], controller: 'users_articles'
        end

        scope '/me' do
          match :drafts, to: 'users_articles#drafts', via: [:get, :options]
          match :articles, to: 'users_articles#index', via: [:get, :options]
          match :total_stats, to: 'total_stats#index', via: [:get, :options]
        end
      end
    end

    root 'api/v1/articles#index'

    #feeds are avaiable in RSS and Atom formats (defaults to Atom) (example: /feed/popular.atom /feed/popular.rss)
    get 'feed/popular', to: 'api/v1/articles#index', defaults: {order: 'popular', format:'atom'}, as: :popular_feed
    get 'feed/latest', to: 'api/v1/articles#index', defaults: {order: 'recents', format:'atom'}, as: :recents_feed
    get 'feed/category/:category_id', to: 'api/v1/articles#index', defaults: {order: 'recents', format:'atom'}, as: :category_feed
    get 'feed/topic/:topic_id', to: 'api/v1/articles#index', defaults: {order: 'recents', format:'atom'}, as: :topic_feed
    get 'feed/user/:user_id', to: 'api/v1/users_articles#index', defaults: {format:'atom'}, as: :user_feed
  end

end
