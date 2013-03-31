require_relative 'errors'

class UberFavoritos < Sinatra::Application
  delete '/favorites/:id' do
    favorite = validate_favorite

    begin
      favorite.delete
    rescue
      raise Errors::InternalServerError
    end

    json({ :id => favorite.id })
  end

  get '/favorites' do
    json Favorite
  end

  post '/favorites' do
    name = validate_name
    address = validate_address

    favorite = nil

    begin
      favorite = Favorite.create(:name => name, :address => address)
    rescue
      raise Errors::InternalServerError
    end

    json({ :id => favorite.id})
  end

  put '/favorites/:id' do
    name = validate_name
    address = validate_address
    favorite = validate_favorite

    begin
      favorite.update(:name => name, :address => address)
    rescue
      raise Errors::InternalServerError
    end

    json({ :id => favorite.id })
  end

  private

  def address_param
    body_params['address']
  end

  def body_params
    @body_params ||= JSON.parse(request.body.read.to_s)
  end

  def id_param
    params[:id].to_i
  end

  def name_param
    body_params['name']
  end

  def validate_address
    address_param.tap do |address|
      raise Errors::InvalidParameters if address.nil? || address.empty?
    end
  end

  def validate_favorite
    Favorite[id_param].tap do |favorite|
      raise Errors::NotFound if favorite.nil?
    end
  end

  def validate_name
    name_param.tap do |name|
      raise Errors::InvalidParameters if name.nil? || name.empty?
    end
  end
end
