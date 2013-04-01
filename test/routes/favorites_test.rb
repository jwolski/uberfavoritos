require_relative '../test_helper'

class FavoritesTest < Test::Unit::TestCase
  def setup
    @browser = Rack::Test::Session.new(mock_session)
  end

  def teardown
    Favorite.delete
  end

  def test_get_favorites
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    @browser.get '/favorites'

    result = response_body.first

    assert @browser.last_response.ok?
    assert_equal 1, response_body.length
    assert_equal favorite.name, result['name']
    assert_equal favorite.address, result['address']
  end

  def test_delete_favorite
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    @browser.delete '/favorites/' + favorite.id.to_s

    assert @browser.last_response.ok?
    assert_nil Favorite[favorite.id]
  end

  def test_delete_unexpected_error
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    Favorite.any_instance.stubs(:delete).raises

    @browser.delete '/favorites/' + favorite.id.to_s

    assert_equal 500, status_code
  end

  def test_delete_favorite_with_invalid_id
    @browser.delete '/favorites/1'

    assert_equal 404, status_code
  end

  def test_create_favorite
    @browser.post '/favorites', data

    assert @browser.last_response.ok?
    assert response_body['id'] > 0
  end

  def test_create_unexpected_error
    Favorite.stubs(:create).raises

    @browser.post 'favorites', data

    assert_equal 500, status_code
  end

  def test_create_favorite_with_invalid_name
    @browser.post '/favorites', invalid_name

    assert_equal 400, status_code
  end

  def test_create_favorite_with_invalid_address
    @browser.post '/favorites', invalid_address

    assert_equal 400, status_code
  end

  def test_update_favorite
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    @browser.put '/favorites/' + favorite.id.to_s, data('New Name', 'New Address')

    favorite.reload

    assert @browser.last_response.ok?
    assert_equal 'New Name', favorite.name
    assert_equal 'New Address', favorite.address
  end

  def test_update_unexpected_error
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    Favorite.any_instance.stubs(:update).raises

    @browser.put '/favorites/' + favorite.id.to_s, data('New Name', 'New Address')

    assert_equal 500, status_code
  end

  def test_update_favorite_with_invalid_name
    @browser.put '/favorites/1', invalid_name

    assert_equal 400, status_code
  end

  def test_update_favorite_with_invalid_address
    @browser.put '/favorites/1', invalid_address

    assert_equal 400, status_code
  end

  def test_update_favorite_with_invalid_id
    @browser.put '/favorites/1', data

    assert_equal 404, status_code
  end

  private

  def application
    UberFavoritos
  end

  def data(name = 'Name', address = 'Address')
    { :name => name, :address => address, :latitude => 0.1, :longitude => 0.2 }.to_json
  end

  def invalid_address
    data('Name', nil)
  end

  def invalid_name
    data(nil, 'Address')
  end

  def mock_session
    Rack::MockSession.new(application)
  end

  def response_body
    JSON.parse(@browser.last_response.body)
  end

  def status_code
    @browser.last_response.status
  end
end
