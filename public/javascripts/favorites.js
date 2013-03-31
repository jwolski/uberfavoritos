var uber = uber || {};

if (typeof(uber.favorites) == 'undefined') {
  uber.favorites = {
    DEBUG: false,
    endpoint: '/favorites',

    init: function() {
      this.log('> init');
      this.setupModels();
      this.setupViews();
      this.setupAddFavoriteHandler();
    },

    favoritesListElement: function() { return $('div#favorites-view ul#favorites-list'); },

    favoritesViewElement: function() { return $('div#favorites-view'); },

    log: function(message) {
      if (uber.favorites.DEBUG) {
        message = message.toString();

        console.log('uber.favorites: ' + message);
      }
    },

    setupAddFavoriteHandler: function() {
      $('#add-favorite').click(function() {
        $('#add-favorite').button('loading');

        favoriteName = $('input[name=favorite-name]').val();
        favoriteAddress = $('input[name=favorite-address]').val();

        favorites.create({
          name: favoriteName,
          address: favoriteAddress
        });

        $('#add-favorite').button('reset');
      });
    },

    setupModels: function() {
      this.log('> setupModels');

      var Favorite = Backbone.Model.extend({ });
      var FavoriteCollection = Backbone.Collection.extend({ model: Favorite, url: this.endpoint });

      window.favorites = new FavoriteCollection();
    },

    setupViews: function() {
      var _self = this;

      this.log('> setupViews');

      // Set up view for individual favorites
      var FavoriteView = Backbone.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'destroy', this.onModelDestroyed);

          this.render();
        },

        events: {
          'click #delete-favorite': 'onDeleteFavoriteClick',
          'click #edit-favorite': 'onEditFavoriteClick'
        },

        onDeleteFavoriteClick: function() {
          this.model.destroy();
        },

        onEditFavoriteClick: function() {
          alert('Favorite Edited!');
        },

        onModelDestroyed: function() {
          this.remove();
        },

        render: function() {
          this.$el.html(this.template(this.model.toJSON()));

          return this;
        },

        template: _.template($('#favorite-template').html())
      });

      // Set up view for collection of favorites
      var FavoritesView = Backbone.View.extend({
        initialize: function() {
          _self.log('> FavoritesView initialize');

          this.listenTo(favorites, 'add', this.onFavoriteAdded);

          return favorites.fetch({
            success: function() {
              return jQuery.getJSON(_self.endpoint, function(data) {
                _.map(data, function(model) { favorites.create(model); });
              });
            }
          });
        },

        el: $('#favorites-view'),

        onFavoriteAdded: function(favorite) {
          _self.log('> FavoritesView addOne');

          var view = new FavoriteView({ model: favorite });

          _self.favoritesListElement().append(view.render().el);
          _self.favoritesViewElement().show();
        }
      });

      var favoritesView = new FavoritesView();
    }
  }
}
