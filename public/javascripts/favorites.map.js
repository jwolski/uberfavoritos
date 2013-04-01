var uber = uber || {};

if (typeof(uber.favorites) == 'undefined') {
  uber.favorites = {};
}

if (typeof(uber.favorites.map) == 'undefined') {
  uber.favorites.map = {
    GEOCODE_ENDPOINT: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=',

    init: function() {
      var mapOptions = {
        center: new google.maps.LatLng(37.775, -122.4183),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 8,
        zoomControl: true
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
    }
  }
}
