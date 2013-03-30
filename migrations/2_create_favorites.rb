Sequel.migration do
  up do
    create_table :favorites do
      primary_key :id

      String :name
      Integer :user_id
      Float :latitude
      Float :longitude
      String :address
    end
  end

  down do
    drop_table :favorites
  end
end

