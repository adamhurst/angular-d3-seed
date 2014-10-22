'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.views',
  'myApp.version',
  'myApp.services',
  'myApp.directives'
    ])

myApp.controller('mainControl', ['$scope','$location', 'dataService', function($scope, $location,dataService){
    dataService.getGeoData().then(function(data){
        $scope.data = data.hashtag.data
        console.debug("NEW DATA")
    })

    $scope.blur = false;

    $scope.setblur = function(){
        if($scope.blur == true){
            $scope.blur = false
            $location.path("/home")
        } else {
            $scope.blur = true
            $location.path("/view2")
        }
        //$scope.blur = !$scope.blur;

    }

    window.control = $scope
}])
