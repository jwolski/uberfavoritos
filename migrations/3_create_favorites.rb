Sequel.migration do
  up do
    create_table :favorites do
      primary_key :id

      String :name
      Integer :user_id
      Integer :location_id
    end
  end

  down do
    drop_table :favorites
  end
end

