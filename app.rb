require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader'

require_relative 'config/init'
require_relative 'app/models/init'
require_relative 'app/routes/init'

class UberFavoritos < Sinatra::Application
  helpers Sinatra::JSON

  set :json_encoder, :to_json
  set :views, Proc.new { File.join(root, 'app/views') }

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
