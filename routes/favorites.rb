class UberFavoritos < Sinatra::Application
  get '/favorites' do
    json [ { :id => 1, :name => 'Home' } ]
  end
end
