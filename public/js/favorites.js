var uber = uber || {};

// Avoid collisions between erb and underscore templates
_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};

if (typeof(uber.favorites) == 'undefined') {
  uber.favorites = {
    DEBUG: false,
    ENDPOINT: '/favorites',
    FAILURE_TITLE: 'Blamo!',
    SUCCESS_TITLE: 'Bingo!',

    $addFavoriteButton: null,
    $favoritesListElement: null,
    $favoritesViewElement: null,
    $noFavoritesElement: null,

    init: function() {
      this.log('> init');

      var _self = uber.favorites;

      _self.$addFavoriteButton = $('#add-favorite');
      _self.$favoritesListElement = $('div#favorites-view ul#favorites-list');
      _self.$favoritesViewElement = $('div#favorites-view');
      _self.$noFavoritesElement = $('#no-favorites');

      this.setupModels();
      this.setupViews();
      this.setupAddFavoriteHandler();
    },

    clearAddFavoriteFields: function() {
      $('#add-favorite-view input[name=favorite-name]').val('');
      $('#add-favorite-view input[name=favorite-address]').val('');
    },

    log: function(message) {
      if (uber.favorites.DEBUG) {
        message = message.toString();

        console.log('uber.favorites: ' + message);
      }
    },

    setupAddFavoriteHandler: function() {
      this.log('> setupAddFavoriteHandler');

      var _self = uber.favorites;

      _self.$addFavoriteButton.click(function() {
        _self.$addFavoriteButton.button('loading');

        var address = $('input[name=favorite-address]').val();

        uber.favorites.map.fetchGeocode(address, {
          success: function(latitude, longtitude) {
            var attrs = {
              name: $('input[name=favorite-name]').val(),
              address: $('input[name=favorite-address]').val(),
              latitude: latitude,
              longitude: longtitude
            };

            favorites.create(attrs, {
              success: function() { flash.success('Welcome a new favorite into the world!'); },
              error: function() { flash.failure('Hey, did you forget a param??!?'); },
              wait: true
            });
          },

          error: function() {
            flash.failure("Couldn't find geocode for that address. Try another!");
          }
        });

        $('#add-favorite').button('reset');
      });
    },

    setupModels: function() {
      this.log('> setupModels');

      var Flash = Backbone.Model.extend({
        isError: null,
        message: null,
        title: null,

        failure: function(msg) {
          this.set({ isError: true, message: msg, title: uber.favorites.FAILURE_TITLE });
        },

        success: function(msg) {
          this.set({ isError: false, message: msg, title: uber.favorites.SUCCESS_TITLE });
        }
      });

      var Favorite = Backbone.Model.extend();
      var FavoriteCollection = Backbone.Collection.extend({ model: Favorite, url: uber.favorites.ENDPOINT });

      window.favorites = new FavoriteCollection();
      window.flash = new Flash();
    },

    setupViews: function() {
      this.log('> setupViews');

      var _self = this;

      // Set up flash
      var FlashView = Backbone.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'change', this.onModelChanged);
        },

        happyTemplate: _.template($('#flash-happy-template').html()),

        el: $('#flash-view'),

        errorTemplate: _.template($('#flash-error-template').html()),

        onModelChanged: function() {
          this.render();
        },

        render: function() {
          if (this.model.get('isError')) {
            this.$el.html(this.errorTemplate(this.model.toJSON()));
          }
          else {
            this.$el.html(this.happyTemplate(this.model.toJSON()));
          }

          return this;
        }
      });

      // Set up view for individual favorites
      var FavoriteView = Backbone.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'destroy', this.onModelDestroyed);
          this.listenTo(this.model, 'change', this.onModelChanged);

          this.render();
        },

        editFields: function() {
          this.showEditFields();
          this.hideNonEditFields();
        },

        events: {
          'click #apply-edit-favorite': 'onApplyEditFavoriteClick',
          'click #cancel-edit-favorite': 'onCancelEditFavoriteClick',
          'click #delete-favorite': 'onDeleteFavoriteClick',
          'click #edit-favorite': 'onEditFavoriteClick'
        },

        hideEditFields: function() {
          this.$el.find('.edit-field').hide();
        },

        hideNonEditFields: function() {
          this.$el.find('.non-edit-field').hide();
        },

        onApplyEditFavoriteClick: function() {
          var _self = this;

          var newAddress = _self.$el.find('input[name=edit-favorite-address]').val();
          var oldName = _self.model.get('name');

          uber.favorites.map.fetchGeocode(newAddress, {
            success: function(latitude, longitude) {
              var newName = _self.$el.find('input[name=edit-favorite-name]').val();

              var attrs = {
                name: newName,
                address: newAddress,
                latitude: latitude,
                longitude: longitude
              };

              _self.model.save(attrs, {
                success: function() {
                  uber.favorites.map.replaceMarker(oldName, newName, latitude, longitude);
                  _self.revertEditFields();

                  flash.success('That old info was no good anyway!! :DD');
                },
                error: function() { flash.failure('Did you forget some required info?'); },
                wait: true
              });
            },

            error: function() {
              flash.failure("Couldn't find geocode for that address. Try another!");
            }
          });
        },

        onCancelEditFavoriteClick: function() {
          this.revertEditFields();
        },

        onDeleteFavoriteClick: function() {
          this.model.destroy({
            success: function() { flash.success("Though, it's so sad to see that favorite go! :((("); },
            error: function() { flash.failure('Something went wrong when deleting that favorite!'); },
            wait: true
          });
        },

        onEditFavoriteClick: function() {
          this.editFields();
        },

        onModelChanged: function() {
          this.render();
        },

        onModelDestroyed: function() {
          this.remove();
        },

        render: function() {
          this.$el.html(this.template(this.model.toJSON()));

          return this;
        },

        revertEditFields: function() {
          this.hideEditFields();
          this.showNonEditFields();
        },

        showEditFields: function() {
          this.$el.find('.edit-field').show();
        },

        showNonEditFields: function() {
          this.$el.find('.non-edit-field').show();
        },

        template: _.template($('#favorite-template').html())
      });

      // Set up view for collection of favorites
      var FavoritesView = Backbone.View.extend({
        initialize: function() {
          _self.log('> FavoritesView initialize');

          this.listenTo(favorites, 'add', this.onFavoriteAdded);
          this.listenTo(favorites, 'destroy', this.onFavoriteDestroyed);

          return favorites.fetch();
        },

        el: $('#favorites-view'),

        onFavoriteAdded: function(favorite) {
          _self.log('> FavoritesView onFavoriteAdded');

          var view = new FavoriteView({ model: favorite });

          _self.$favoritesListElement.append(view.render().el);
          _self.$favoritesViewElement.show();
          _self.$noFavoritesElement.hide();
          _self.clearAddFavoriteFields();

          uber.favorites.map.addMarker(
            favorite.get('name'),
            favorite.get('latitude'),
            favorite.get('longitude'));
        },

        onFavoriteDestroyed: function(favorite) {
          if (favorites.length === 0) {
            _self.$noFavoritesElement.show();
          }

          uber.favorites.map.removeMarker(favorite.get('name'));
        }
      });

      var favoritesView = new FavoritesView();
      var flashView = new FlashView({ model: flash });
    }
  }
}