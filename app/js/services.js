
angular.module('myApp.services', [])
    .factory('appConfig', function(){
        return {
            sharedData: []
        }
    })
    .factory('dataService', function($http) {

        var baseURI = 'http://acolourfulworld.3w.nu/backend/hashtag/'

        var promise; // Caching the get promise to avoid multiple calls to the server

        var dataService = {
            getGeoData: function() {
                console.debug("geoData Service")
                if ( !promise ) {
                    // $http returns a promise, which has a then function, which also returns a promise
                    promise = $http.get( baseURI+'doctorswithoutborders' ).then(function (response) {
                        // The then function is an opportunity to modify the response
                        // The return value gets picked up by the then in the controller.
                        return response.data;
                    });
                }
                // Return the promise to the controller
                return promise;
            },
            postGeoData: function() {
                $http(
                    {
                        url: baseURI + '/backendPOST/',
                        method: "POST",
                        data: '&val=' + Math.round(value) + '&lat=' + lat + '&lon=' + lon
                    })
                    .then(
                        function(response) {
                            return response
                        },
                        function(response) {
                            return response
                        }
                    );
                }
            };

        // Used by controller: dataService.getGeoData().then(function(d){ $scope.data = d })
        return dataService;
    });