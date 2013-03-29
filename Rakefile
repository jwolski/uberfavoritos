require 'sequel'

namespace :db do
  namespace :migrate do
    Sequel.extension :migration

    connection = Sequel.connect(ENV['DATABASE_URL'] || 'postgres://localhost/uberfavoritos')

    task :down do
      Sequel::Migrator.run(connection, 'migrations', :target => 0)
    end

    task :up do
      Sequel::Migrator.run(connection, 'migrations')
    end
  end
end
