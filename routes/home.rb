class UberFavoritos < Sinatra::Application
  get '/' do
    erb :index
  end
end
