require 'sinatra'
require 'sinatra/reloader'
require 'sequel'

class UberFavoritos < Sinatra::Application
  set :json_encoder, :to_json

  configure :development do
    register Sinatra::Reloader
  end
end

Sequel::Model.plugin :json_serializer

require_relative 'config/database'
require_relative 'models/favorite'
require_relative 'models/location'
require_relative 'models/user'
require_relative 'routes/home'
require_relative 'routes/favorites'
