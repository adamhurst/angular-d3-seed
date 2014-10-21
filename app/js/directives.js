angular.module('myApp.directives', [])
    .directive('geoVisualisation', ['appConfig','$location',function(appConfig, $location){
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {


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

                var svg = d3.select(element[0]).append("svg")
                    .attr("class", "css-filter-blur")
                    .attr("width", window.innerWidth)
                    .attr("height", window.innerHeight)
                    .on("click",redirect)

                function redirect(){

                    if(!activeFilter){
                        activeFilter = true;
                        $location.path("/view2")
                        scope.$apply()

                        d3.select("#blur")
                            .transition()
                            .duration(1000)
                            .ease("linear")
                            .attrTween("stdDeviation", function (d, i, a) {
                                return d3.interpolate(a, 25);
                            });
                    } else {
                        activeFilter = false;
                        $location.path("/home")
                        scope.$apply()

                        d3.select("#blur")
                            .transition()
                            .duration(1000)
                            .attrTween("stdDeviation", function (d, i, a) {
                                return d3.interpolate(a, 0);
                            });
                    }
                }


                var activeFilter = false;
                var filter = svg.append("defs")
                    .append("filter")
                    .attr("id", "f1")
                    .attr("x",0)
                    .attr("y",0)
                    .append("feGaussianBlur")
                    .attr("id", "blur")
                    .attr("in", "SourceGraphic")
                    .attr("stdDeviation", 0)

                var data  = d3.range(500).map(function(d){return {x: window.innerWidth*Math.random(), y: window.innerHeight*Math.random()}})

                var g = svg.append("g")
                    .attr("filter","url(#f1)")

                var circles = g.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx",function(d){return d.x})
                    .attr("cy",function(d){return d.y})
                    .attr("r", 6)

            }
        }}
    ])