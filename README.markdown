uberfavoritos!
====

This is a small little web app that allows you to add favorite locations!

Usage (Functionality):
----
* Adding favorites: Add a favorite from the left side bar by filling in both required fields and clicking the Add button. When typing in the Address field, the address will be auto-completed using Google's Places API. After clicking the Add button, a Geocode lookup is performed against Google's Geocode API.
* Deleting favorites: Delete a favorite by clicking the Delete button in the list of favorites.
* Editing favorites: Edit a favorite by clicking the Edit button in the list of favorites, filling in both required fields and by clicking the Apply button. You can also cancel out of the modifications by clicking the Cancel button.
* Flashes messages - Flash messages will appear with every action performed
* Pin drop: Pins drop on initial page load (for existing favorites) and any that you may add later
* Pin replacement: Pins are replaced
* Pin removal:  Pins are removed when a favorite is deleted

Directory structure:
----
* /app/models - ORM mappings
* /app/routes - Endpoint definitions
* /app/views - ERB templates
* /config - Configuration initializers
* /migrations - Database migrations (see Rakefile to run)
* /public/css - App and vendor stylesheets
* /public/img - Vendor images
* /public/js - App and vendor javascripts
* /test/routes - Functional tests for endpoints

Rake tasks:
----
* db:data:clear - Clears all data from tables
* db:data:seed - Adds some seed data
* db:migrate:down - Resets DB
* db:migrate:up - Migrates to latest
* test:run - Runs functional tests

Backend tech:
----
* Heroku
* Postgres
* Rack
* Sinatra
* Sequel

Frontend tech:
----
* Backbone
* (Twitter) Bootstrap
* jQuery
* Google Maps API
* Underscore

Assumptions made:
----
1. Single user system
2. Integer based migrations instead of timestamp
3. Denormalized storage of favorites
4. Did not use Sprockets for asset pipelining
5. Some functional tests rely on DB
