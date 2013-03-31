class UberFavoritos < Sinatra::Application
  get '/favorites' do
    json Favorite
  end

  delete '/favorites/:id' do
    if favorite = Favorite[params[:id].to_i]
      favorite.delete
    end

    json []
  end

  post '/favorites' do
    Favorite.create(:name => body_params['name'], :address => body_params['address'])

    json []
  end

  private

  def body_params
    @body_params ||= JSON.parse(request.body.read.to_s)
  end
end
