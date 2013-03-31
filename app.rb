require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader'
require 'sequel'

require_relative 'routes/errors'

class UberFavoritos < Sinatra::Application
  helpers Sinatra::JSON

  set :json_encoder, :to_json

  configure :development do
    register Sinatra::Reloader
  end

  error Errors::InternalServerError do
    response.status = 500
  end

  error Errors::InvalidParameters do
    response.status = 400
  end

  error Errors::NotFound do
    response.status = 404
  end
end

Sequel::Model.plugin :json_serializer

require_relative 'config/database'
require_relative 'models/favorite'
require_relative 'models/user'
require_relative 'routes/home'
require_relative 'routes/favorites'
