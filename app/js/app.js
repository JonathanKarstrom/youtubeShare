const app = angular.module("myApp", ["ngRoute", 'youtube-embed']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'mainCtrl'
    })
    .when('/:id', {
      templateUrl: 'partials/room.html',
      controller: 'roomCtrl'
    });

  $locationProvider.html5Mode(true);
});

app.factory('socket', function ($rootScope) {
  let socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        let args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});





