
angular.module('myApp.services', [])
    .factory('appConfig', function(){
        return {
            sharedData: []
        }
    })
    .factory('dataService', function($http) {
        // http://download.geonames.org/export/dump/
        var baseURI = 'http://acolourfulworld.3w.nu/backend/hashtag/'

        var promise // t // Caching the get promise to avoid multiple calls to the server

        var dataService = {
            getGeoData: function() {
                console.debug("geoData Service")
                if ( !promise ) {
                    // $http returns a promise, which has a then function, which also returns a promise
                    promise = $http.get( baseURI+'doctorswithoutborders' ).then(function (response) {
                        // The then function is an opportunity to modify the response
                        // The return value gets picked up by the then in the controller.
                        //console.debug(response)
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
    })
    /*
    .service('rssservice', function() {
        // http://download.geonames.org/export/dump/
        //var baseURI = 'http://acolourfulworld.3w.nu/backend/hashtag/'
        // <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        google.load("feeds", "1");

        function initialise() {
            var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
            feed.load(function(result) {
                if (!result.error) {
                    //var container = document.getElementById("feed");
                    for (var i = 0; i < result.feed.entries.length; i++) {
                        console.debug(result.feed.entries[i])
                        //var entry = result.feed.entries[i];
                        //var div = document.createElement("div");
                        //div.appendChild(document.createTextNode(entry.title));
                        //container.appendChild(div);
                    }
                }
            });
        }

        google.setOnLoadCallback(initialise);

        this.yahoo = initialise



        // Used by controller: dataService.getGeoData().then(function(d){ $scope.data = d })
        //return rssService;
    })*/