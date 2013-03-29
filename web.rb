require 'sinatra'
require 'sinatra/json'

class UberFavoritos < Sinatra::Application
end

require_relative 'config/database'
require_relative 'models/favorite'
require_relative 'models/location'
require_relative 'models/user'
require_relative 'routes/home'
require_relative 'routes/favorites'
