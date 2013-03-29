class UberFavoritos < Sinatra::Application
  get '/favorites' do
    json Favorite
  end
end
