require 'sequel'

Sequel::Model.plugin :json_serializer

configure :development do
  Sequel.connect('postgres://localhost/uberfavoritos')
end

configure :production do
  Sequel.connect(ENV['DATABASE_URL'])
end
