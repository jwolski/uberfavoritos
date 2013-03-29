require 'sequel'

configure do
  Sequel.connect(ENV['DATABASE_URL'] || 'postgres://localhost/uberfavoritos')
end
