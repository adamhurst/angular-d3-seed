angular.module('myApp.directives', [])
    .directive('geoVisualisation', ['appConfig',function(appConfig){
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                var w = 200,
                    h = 200

                var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)

                function watchFunc(){
                    return window.innerWidth + window.innerHeight
                }

                function resize(){
                    w = window.innerWidth;
                    h = window.innerHeight;

                    svg.attr("width", w)
                       .attr("height", h);
                }

                scope.$watch(watchFunc, resize)

                scope.$watch('data.length', function(newData, oldData){
                    if(newData !== oldData){
                        // Visualise new data

                    }
                })
            }
        }}
    ])