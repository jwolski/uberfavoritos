require 'sequel'

def establish_connection
  Sequel.connect(ENV['DATABASE_URL'] || 'postgres://localhost/uberfavoritos')
end

def generate_favorite(user, name, address)
  favorite_attrs = {
    :name => name,
    :user_id => user.id,
    :latitude => 0.0,
    :longitude => 0.0,
    :address => address
  }

  Favorite.create(favorite_attrs)
end

namespace :db do
  namespace :migrate do
    Sequel.extension :migration

    connection = establish_connection

    task :down do
      Sequel::Migrator.run(connection, 'migrations', :target => 0)
    end

    task :up do
      Sequel::Migrator.run(connection, 'migrations')
    end
  end

  namespace :data do
    establish_connection

    require_relative 'models/favorite'
    require_relative 'models/user'

    task :seed do
      me = User.create(:first_name => 'Jeff', :last_name => 'Wolski', :username => 'jwolski')

      generate_favorite(me, 'Home', '123 Some St., San Francisco, CA')
      generate_favorite(me, 'BK Home', '456 End Ct., Brooklyn, NY')
      generate_favorite(me, 'LB Home', '789 That Ave., Long Beach, NY')
    end

    task :clear do
      [Favorite, User].map(&:delete)
    end
  end
end
