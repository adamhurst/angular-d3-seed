angular.module('myApp.views', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
         /*
         <ul class="menu">
             <li><a href="#/view1">view1</a></li>
             <li><a href="#/view2">view2</a></li>
         </ul>
         */

        $routeProvider
            .when('/home', {
                templateUrl: 'views/home/homeView.html',
                controller: 'homeCtrl'
            })
            .when('/view2', {
                templateUrl: 'views/view2/view2.html',
                controller: 'View2Ctrl'
            })
            .otherwise({redirectTo: '/home'})
        }
    ]);
