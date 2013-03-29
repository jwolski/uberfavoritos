require 'haml'

class UberFavoritos < Sinatra::Application
  get '/' do
    haml :index
  end
end
