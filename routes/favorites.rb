class UberFavoritos < Sinatra::Application
  get '/favorites' do
    favorites = Favorite.all.map { |f| { :id => f.id, :name => f.name } }

    json favorites
  end
end
