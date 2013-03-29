class UberFavoritos < Sinatra::Application
  get '/favorites' do
    json Favorite
  end

  delete '/favorites' do
    Favorite.delete
  end
end
