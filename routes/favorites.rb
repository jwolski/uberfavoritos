require_relative 'errors'

class UberFavoritos < Sinatra::Application
  delete '/favorites/:id' do
    favorite = validate_favorite

    begin
      favorite.delete
    rescue => ex
      logger.error "An error occurred while trying to delete a favorite, error='#{ex.message}' id=#{favorite.id}"

      raise Errors::InternalServerError
    end

    json({ :id => favorite.id })
  end

  get '/favorites' do
    # TODO Introduce pagination for large-ish data sets
    json Favorite
  end

  post '/favorites' do
    name = validate_name
    address = validate_address
    latitude = validate_latitude
    longitude = validate_longitude

    favorite = nil

    begin
      favorite = Favorite.create(:name => name, :address => address, :latitude => latitude, :longitude => longitude)
    rescue => ex
      logger.error "An error occurred while trying to create a favorite, error=#{ex.message} name='#{name}' address='#{address}'"

      raise Errors::InternalServerError
    end

    json({ :id => favorite.id})
  end

  put '/favorites/:id' do
    name = validate_name
    address = validate_address
    latitude = validate_latitude
    longitude = validate_longitude
    favorite = validate_favorite

    begin
      favorite.update(:name => name, :address => address, :latitude => latitude, :longitude => longitude)
    rescue => ex
      logger.error "An error occurred while trying to update a favorite, error='#{ex.message}' id=#{favorite.id} name='#{name}' address='#{address}'"

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

  def latitude_param
    body_params['latitude']
  end

  def longitude_param
    body_params['longitude']
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

  def validate_latitude
    latitude_param.tap do |latitude|
      raise Errors::InvalidParameters if latitude.nil?
    end
  end

  def validate_longitude
    longitude_param.tap do |longitude|
      raise Errors::InvalidParameters if longitude.nil?
    end
  end

  def validate_name
    name_param.tap do |name|
      raise Errors::InvalidParameters if name.nil? || name.empty?
    end
  end
end
