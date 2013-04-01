var uber = uber || {};

if (typeof(uber.favorites) == 'undefined') {
  uber.favorites = {};
}

if (typeof(uber.favorites.map) == 'undefined') {
  uber.favorites.map = {
    init: function() {
      var mapOptions = {
        center: new google.maps.LatLng(37.7750, 122.4183),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 8,
        zoomControl: true
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }
  }
}
