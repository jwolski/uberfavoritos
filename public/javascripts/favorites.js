var uber = uber || {};

// Avoid collisions between erb and underscore templates
_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};

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

    clearAddFavoriteFields: function() {
      $('#add-favorite-view input[name=favorite-name]').val('');
      $('#add-favorite-view input[name=favorite-address]').val('');
    },

    favoritesListElement: function() { return $('div#favorites-view ul#favorites-list'); },

    favoritesViewElement: function() { return $('div#favorites-view'); },

    log: function(message) {
      if (uber.favorites.DEBUG) {
        message = message.toString();

        console.log('uber.favorites: ' + message);
      }
    },

    noFavoritesElement: function() { return $('#no-favorites'); },

    setupAddFavoriteHandler: function() {
      this.log('> setupAddFavoriteHandler');

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

      var Favorite = Backbone.Model.extend();
      var FavoriteCollection = Backbone.Collection.extend({ model: Favorite, url: this.endpoint });

      window.favorites = new FavoriteCollection();
    },

    setupViews: function() {
      this.log('> setupViews');

      var _self = this;

      // Set up view for individual favorites
      var FavoriteView = Backbone.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'destroy', this.onModelDestroyed);
          this.listenTo(this.model, 'change', this.onModelChanged);

          this.render();
        },

        events: {
          'click #delete-favorite': 'onDeleteFavoriteClick',
          'click #edit-favorite': 'onEditFavoriteClick',
          'click #apply-edit-favorite': 'onApplyEditFavoriteClick'
        },

        onApplyEditFavoriteClick: function() {
          this.model.save({
            name: $('input[name=edit-favorite-name]').val(),
            address: $('input[name=edit-favorite-address]').val()
          });
        },

        onDeleteFavoriteClick: function() {
          this.model.destroy();
        },

        onEditFavoriteClick: function() {
          $('input[name=edit-favorite-name]').val(this.model.get('name'));
          $('input[name=edit-favorite-address]').val(this.model.get('address'));
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

          _self.favoritesListElement().append(view.render().el);
          _self.favoritesViewElement().show();
          _self.noFavoritesElement().hide();
          _self.clearAddFavoriteFields();
        },

        onFavoriteDestroyed: function(favorite) {
          if (favorites.length === 0) {
            _self.noFavoritesElement().show();
          }
        }
      });

      var favoritesView = new FavoritesView();
    }
  }
}
