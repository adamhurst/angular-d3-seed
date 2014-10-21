'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.views',
  'myApp.version',
  'myApp.services',
  'myApp.directives'
    ])

myApp.controller('mainControl', ['$scope','dataService', function($scope, dataService){
    dataService.getGeoData().then(function(data){
        $scope.data = data.hashtag.data;
        console.debug("NEW DATA")
    })
    window.control = $scope
}])
