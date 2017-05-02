'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  // 'myApp.home',
  'app.viewDashboard',
  // 'myApp.home',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/my-updates-dashboard'});
}]);
