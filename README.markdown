uberfavoritos!
====

This is a small little web app that allows you to manage your favorite locations - add, delete, edit and locate your favorites on a map. Please see the exercise in all of its glory at http://uberfavoritos.herokuapp.com!

Usage (Functionality):
----
* Adding favorites: Add a favorite from the left side bar by filling in both required fields and clicking the Add button. When typing in the Address field, the address will be auto-completed using Google's Places API. After clicking the Add button, a Geocode lookup is performed against Google's Geocode API.
* Deleting favorites: Delete a favorite by clicking the Delete button in the list of favorites.
* Editing favorites: Edit a favorite by clicking the Edit button in the list of favorites, filling in both required fields and by clicking the Apply button. You can also cancel out of the modifications by clicking the Cancel button.
* Flashes messages - Flash messages will appear with every action performed
* Pin drop: Pins drop on initial page load (for existing favorites) and any that you may add later. Hover over the pin and a tooltip will tell you the name of the favorite.
* Pin replacement: Pins are replaced
* Pin removal:  Pins are removed when a favorite is deleted

Directory structure:
----
* app/models - ORM mappings
* app/routes - Endpoint definitions
* app/views - ERB templates
* config - Configuration initializers
* migrations - Database migrations (see Rakefile to run)
* public/css - App and vendor stylesheets
* public/img - Vendor images
* public/js - App and vendor javascripts
* test/routes - Functional tests for endpoints

Endpoints:
----
* DELETE /favorites/:id - Deletes a favorite provided an ID
* GET /favorites - Returns a list of all favorites
* POST /favorites - Creates a favorite provided: name, address, latitude and longitude
* PUT /favorites/:id - Updates a favorite provided: id, name, address, latitude and longitude

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

Tested on:
----
* Firefox 19.0 for Mac
* Chrome 25.0 for Mac

Frontend tech:
----
* Backbone
* (Twitter) Bootstrap
* jQuery
* Google Maps API
* Underscore

Assumptions made:
----
1. Single user system. I introduced a User model with the association built between User and Favorite, but am currently not building the assocation upon creation of any favorites.
2. Integer based migrations. I used these instead of timestamp migrations since I'm only a single dev and it's more readable.
3. Denormalized storage of favorites. I toyed with abstracting a Location out from Favorite and have a Favorite be a simple mapping between a User and a Location, but decided to keep it simple for this exercise.
4. Did not use Sprockets for asset pipelining. I left this for a future exercise and felt it was unnecessary for the exercise.
5. Some functional tests rely on DB. I'd rather eliminate as many external dependencies that I can from my tests, but these functional tests are built to rely on models being placed in the DB.

If you've made it this far, thanks for reading. I hope you enjoy.
