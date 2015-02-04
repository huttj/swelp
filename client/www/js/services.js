angular.module('starter.services', [])

.factory('Search', function($http, $q) {
  var S = {};

  function request(location) {
    return $http.get('http://104.131.140.95:5000/' + location).then(function (data) {
      console.log(data);
      return data.data.businesses;
    });
  }

  S.search = function(location) {
    if (!location || location.length === 0) {

      var deferred = $q.defer();

      var opts = {};

      try {
        var watchId = navigator.geolocation.watchPosition(success, failure, opts);
      } catch (e) {
        deferred.resolve('Geolocation not available.');
      }

      return deferred.promise;

      function success(position) {
        navigator.geolocation.clearWatch(watchId);
        var location = position.coords.latitude + ',' + position.coords.longitude;
        console.log(location);
        deferred.resolve(request(location));
      }

      function failure() {
        alert('Failed to get current position. Is geolocation enabled?');
        navigator.geolocation.clearWatch(watchId);
      }

    } else {
      return request(location);
    }
  };

  return S;
})

.filter('range', function() {
  var memo = {};
  return function(n) {
    n = Math.floor(n);

    if (memo[n]) return memo[n];

    var arry = [];
    for (var i = 0; i < n; i++) {
      arry.push(i);
    }
    return memo[n] = arry;

    //return arry;
  }
})

.filter('round', function () {
  return function(n) {
    if (typeof n !== 'number') return '?';

    if (n > 3) {
      return Math.floor(n);
    } else if (n > 1) {
      return n.toPrecision(1);
    } else {
      return (n.toPrecision(1)).substr(1);
    }
  }
});
