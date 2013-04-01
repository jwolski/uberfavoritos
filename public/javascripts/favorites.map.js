var uber = uber || {};

if (typeof(uber.favorites) == 'undefined') {
  uber.favorites = {};
}

if (typeof(uber.favorites.map) == 'undefined') {
  uber.favorites.map = {
    GEOCODE_ENDPOINT: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=',

    markers: [],

    init: function() {
      var mapOptions = {
        center: new google.maps.LatLng(37.775, -122.4183),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 12,
        zoomControl: true
      };

      window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      this.setupAutocomplete();
    },

    addMarker: function(name, latitude, longitude) {
      var _self = uber.favorites.map;

      var latLng = new google.maps.LatLng(latitude, longitude);

      var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: latLng,
          map: map,
          title: name
      });

      _self.markers.push(marker);
    },

    fetchGeocode: function(address, options) {
      $.getJSON(uber.favorites.map.GEOCODE_ENDPOINT + address, function(data) {
        if (typeof(data['results']) == 'undefined' ||
          typeof(data['results'][0]) == 'undefined' ||
          typeof(data['results'][0]['geometry']) == 'undefined' ||
          typeof(data['results'][0]['geometry']['location']) == 'undefined' ||
          typeof(data['results'][0]['geometry']['location']['lat']) == 'undefined' ||
          typeof(data['results'][0]['geometry']['location']['lng']) == 'undefined') {
          options['error']();
        }
        else {
          var latitude = data['results'][0]['geometry']['location']['lat'];
          var longitude = data['results'][0]['geometry']['location']['lng'];

          options['success'](latitude, longitude);
        }
      });
    },

    replaceMarker: function(oldName, newName, latitude, longitude) {
      var _self = uber.favorites.map;

      _self.removeMarker(oldName);
      _self.addMarker(newName, latitude, longitude);
    },

    removeMarker: function(name) {
      var _self = uber.favorites.map;

      _.each(_self.markers, function(marker) {
        if (marker.getTitle() === name) {
          marker.setMap(null);
        }
      });
    },

    setupAutocomplete: function() {
      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(37.775, -122.4183),
        new google.maps.LatLng(37.775, -122.4183));

      var input = document.getElementById('favorite-address');

      var options = { bounds: defaultBounds };

      autocomplete = new google.maps.places.Autocomplete(input, options);
    }
  }
}
