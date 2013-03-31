require_relative '../test_helper'

class FavoritesTest < Test::Unit::TestCase
  def setup
    @browser = Rack::Test::Session.new(mock_session)
  end

  def teardown
    Favorite.delete
  end

  def test_get_favorites
    @browser.get '/'

    assert @browser.last_response.ok?
  end

  def test_delete_favorite
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    @browser.delete '/favorites/' + favorite.id.to_s

    assert @browser.last_response.ok?
    assert_nil Favorite[favorite.id]
  end

  def test_delete_favorite_with_invalid_id
    @browser.delete '/favorites/1'

    assert_equal 404, status_code
  end

  def test_create_favorite
    favorite = Favorite.create(:name => 'Home', :address => '123 Some St.')

    @browser.delete '/favorites/' + favorite.id.to_s

    assert @browser.last_response.ok?
    assert_nil Favorite[favorite.id]
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
    { :name => name, :address => address }.to_json
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

  def status_code
    @browser.last_response.status
  end
end
