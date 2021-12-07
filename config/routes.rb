Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :games do
    resources :game_tags
  end

  resources :tags do
    resources :game_tags
  end

  resources :game_tags

end
