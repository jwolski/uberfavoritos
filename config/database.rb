require 'sequel'

# :naked prevents json_class from being added into JSON returned from endpoint
Sequel::Model.plugin :json_serializer, :naked => true

configure :development do
  Sequel.connect('postgres://localhost/uberfavoritos')
end

configure :production do
  Sequel.connect(ENV['DATABASE_URL'])
end
