require 'sequel'

def establish_connection
  Sequel.connect(ENV['DATABASE_URL'] || 'postgres://localhost/uberfavoritos')
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

      favorite_attrs = {
        :name => 'Home',
        :user_id => me.id,
        :latitude => 0.0,
        :longitude => 0.0,
        :address => '123 Some St., San Francisco, CA 94110'
      }

      Favorite.create(favorite_attrs)
    end

    task :clear do
      [Favorite, User].map(&:delete)
    end
  end
end
