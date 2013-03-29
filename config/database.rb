require 'sequel'

configure :development do
  Sequel.connect('postgres://localhost/uberfavoritos')
end

configure :production do
  Sequel.connect(ENV['DATABASE_URL'])
end
