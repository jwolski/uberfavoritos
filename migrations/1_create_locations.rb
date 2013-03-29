Sequel.migration do
  up do
    create_table :locations do
      primary_key :id

      Float :latitude
      Float :longitude
      String :address, :null => false
    end
  end

  down do
    drop_table :locations
  end
end
