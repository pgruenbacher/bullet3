/**
 * Handle Google Maps API V3+
 */
 /*jshint ignore:start*/
// - Documentation: https://developers.google.com/maps/documentation/
'use strict';
angular.module('Bullet3.appMap',[])
.controller('GpsCtrl',function($scope, $ionicPlatform, $location) {

  // init gps array
  $scope.whoiswhere = [];
  $scope.basel = {};
  $scope.mapCreated=function(map){
    console.log('map created',map);
    $scope.map=map;
  };
  $scope.getCenter=function(){
    var c=$scope.map.getCenter();
    $scope.setCoordinates(c);
    $scope.hideMap();
  }
  // check login code
  $ionicPlatform.ready(function() {
    navigator.geolocation.getCurrentPosition(function(position){
      console.log('got position',position);
      $scope.position=position;
        var c = position.coords;
        console.log('user coordinates',c);
        //$scope.gotoLocation(c.latitude, c.longitude);
        $scope.map.setCenter(new google.maps.LatLng(c.latitude,c.longitude));
      $scope.$apply();
    },function(e) {
      console.log("Error retrieving position " + e.code + " " + e.message);
    });
    $scope.gotoLocation = function (lon, lat) {
      if ($scope.lat != lat || $scope.lon != lon) {
        $scope.basel = {lon: lon,lat: lat};
        // if (!$scope.$$phase){
        //   $scope.$apply("basel");
        // }
      }
      console.log('basel',$scope.basel,$scope.$$phase);
    };
    // some points of interest to show on the map
    // to be user as markers, objects should have "lat", "lon", and "name" properties
    $scope.whoiswhere = [
        { "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon },
    ];

  });

})
// formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
.filter('lat', function () {
  return function (input, decimals) {
    if(typeof input ==='undefined'){return '';}
    if (!decimals) decimals = 0;
    input = input * 1;
    var ns = input > 0 ? "N" : "S";
    input = Math.abs(input);
    var deg = Math.floor(input);
    var min = Math.floor((input - deg) * 60);
    var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
    return deg + "°" + min + "'" + sec + '"' + ns;
  }
})
// formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
.filter('lon', function () {
  return function (input, decimals) {
    if(typeof input ==='undefined'){return '';}
    if (!decimals) decimals = 0;
    input = input * 1;
    var ew = input > 0 ? "E" : "W";
    input = Math.abs(input);
    var deg = Math.floor(input);
    var min = Math.floor((input - deg) * 60);
    var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
    return deg + "°" + min + "'" + sec + '"' + ew;
  }
})
// .directive('appMap', function($window) {
//   return {
//     restrict: 'E',
//     scope: {
//       onCreate: '&'
//     },
//     link: function ($scope, $element, $attr) {
//       function loadGMaps() {
//         console.log('map: start loading js gmaps');
//         var script = $window.document.createElement('script');
//         script.type = 'text/javascript';
//         script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
//         $window.document.body.appendChild(script);
//       }
//       var callbackName = 'InitMapCb';
//       // callback when google maps is loaded
//       $window[callbackName] = function() {
//         console.log('map: init callback');
//         initialize();
//       };

//       if (!$window.google || !$window.google.maps ) {
//         console.log('map: not available - load now gmap js');
//         loadGMaps();
//       }
//       else{
//         console.log('map: IS available - create only map now');
//         initialize();
//       }
//       function initialize() {
//         var mapOptions = {
//           center: new google.maps.LatLng(43.07493, -89.381388),
//           zoom: 16,
//           mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
//         var map = new google.maps.Map($element[0], mapOptions);
  
//         $scope.onCreate({map: map});

//         // Stop the side bar from dragging when mousedown/tapdown on the map
//         google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
//           e.preventDefault();
//           return false;
//         });
//       }
//     }
//   };
// });
.directive('appMap', function ($window) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div><i class="icon ion-ios7-location"></i></div>',
    scope: {
      center: '=',        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
      markers: '=',       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: 'hello' }]</code>).
      width: '@',         // Map width in pixels.
      height: '@',        // Map height in pixels.
      zoom: '@',          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
      mapTypeId: '@',     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
      panControl: '@',    // Whether to show a pan control on the map.
      zoomControl: '@',   // Whether to show a zoom control on the map.
      scaleControl: '@',   // Whether to show scale control on the map.
      onCreate: '&'        // Callback to the controller
    },
    link: function (scope, element, attrs) {
      var toResize, toCenter;
      var reticleMarker;
      var map;
      var infowindow;
      var currentMarkers;
      var callbackName = 'InitMapCb';

      // callback when google maps is loaded
      $window[callbackName] = function() {
        console.log('map: init callback');
        createMap();
        updateMarkers();
      };

      if (!$window.google || !$window.google.maps ) {
        console.log('map: not available - load now gmap js');
        loadGMaps();
      }
      else{
        console.log('map: IS available - create only map now');
        createMap();
      }
      function loadGMaps() {
        console.log('map: start loading js gmaps');
        var script = $window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
        $window.document.body.appendChild(script);
      }

      function createMap() {
        console.log('map: create map start');
        var mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(40, -83.0145),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: true,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          navigationControl: true,
          disableDefaultUI: true,
          overviewMapControl: false
        };
        if (!(map instanceof google.maps.Map)) {
          console.log('map: create map now as not already available ');
          map = new google.maps.Map(element[0], mapOptions);
          // EDIT Added this and it works on android now
          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener(element[0], 'mousedown', function(e) {
            e.preventDefault();
            return false;
          });
          console.log('map instance',map)
          scope.onCreate({map:map});
          //infowindow = new google.maps.InfoWindow(); 
        }
      }

      // scope.$watch('markers', function() {
      //   updateMarkers();
      // });

      // Info window trigger function 
      // function onItemClick(pin, label, datum, url) { 
      //   // Create content  
      //   var contentString = 'Name: ' + label + '<br />Time: ' + datum;
      //   // Replace our Info Window's content and position
      //   infowindow.setContent(contentString);
      //   infowindow.setPosition(pin.position);
      //   infowindow.open(map)
      //   google.maps.event.addListener(infowindow, 'closeclick', function() {
      //     //console.log('map: info windows close listener triggered ');
      //     infowindow.close();
      //   });
      // } 

      function markerCb(marker, member, location) {
          return function() {
          //console.log('map: marker listener for ' + member.name);
          var href='http://maps.apple.com/?q='+member.lat+','+member.lon;
          map.setCenter(location);
          onItemClick(marker, member.name, member.date, href);
        };
      }
      function centerReticle(){
        reticleMarker.setPosition(map.getCenter());
      }
      // // update map markers to match scope marker collection
      function updateMarkers() {
        if (map && scope.markers) {
          // create new markers
          var reticleImage = new google.maps.MarkerImage(
            'img/reticle.gif',            // marker image
            new google.maps.Size(63, 63),    // marker size
            new google.maps.Point(0,0),      // marker origin
            new google.maps.Point(32, 32));  // marker anchor point
          var reticleShape = {
            coords: [32,32,32,32],           // 1px
            type: 'rect'                     // rectangle
          };
          reticleMarker = new google.maps.Marker({
            position: new google.maps.LatLng(40, -83.0145),
            map: map,
            icon: reticleImage, 
            shape: reticleShape,
            optimized: false,
            zIndex: 5
          });
          google.maps.event.addListener(map, 'bounds_changed', centerReticle);
          //console.log('map: make markers ');
          currentMarkers = [];
          var markers = scope.markers;
          if (angular.isString(markers)) markers = scope.$eval(scope.markers);
          for (var i = 0; i < markers.length; i++) {
            var m = markers[i];
            var loc = new google.maps.LatLng(m.lat, m.lon);
            var mm = new google.maps.Marker({ position: loc, map: map, title: m.name });
            //console.log('map: make marker for ' + m.name);
            google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
            currentMarkers.push(mm);
          }
        }
      }

      // // convert current location to Google maps location
      // function getLocation(loc) {
      //   if (loc == null) return new google.maps.LatLng(40, -73);
      //   if (angular.isString(loc)) loc = scope.$eval(loc);
      //   return new google.maps.LatLng(loc.lat, loc.lon);
      // }

    } // end of link:
  }; // end of return
});