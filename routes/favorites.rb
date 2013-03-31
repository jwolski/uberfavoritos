class UberFavoritos < Sinatra::Application
  delete '/favorites/:id' do
    if favorite = Favorite[id_param]
      favorite.delete
    end

    json []
  end

  get '/favorites' do
    json Favorite
  end

  post '/favorites' do
    favorite = Favorite.create(:name => body_params['name'], :address => body_params['address'])

    json({ :id => favorite.id })
  end

  put '/favorites/:id' do
    if favorite = Favorite[id_param]
      favorite.update(:name => body_params['name'], :address => body_params['address'])
    end

    json []
  end

  private

  def address_param
    body_params['address']
  end

  def body_params
    @body_params ||= JSON.parse(request.body.read.to_s)
  end

  def name_param
    body_params['name']
  end
end
