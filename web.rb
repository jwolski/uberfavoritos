require 'sinatra'
require 'sinatra/json'

class UberFavoritos < Sinatra::Application
  configure :development do
  end
end

require_relative 'routes/home'
require_relative 'routes/favorites'
