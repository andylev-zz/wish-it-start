Rails.application.routes.draw do

root      'home#index'
resources :home, only: [:index, :new, :create]

end
