Manshar::Application.routes.draw do
  root 'home#index'
  get '*page' => 'home#index'
end
