class Favorite < Sequel::Model
  one_to_one :location
  one_to_one :user
end
