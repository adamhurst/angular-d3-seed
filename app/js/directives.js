angular.module('myApp.directives', [])
    .directive('geoVisualisation', ['appConfig','$location',function(appConfig, $location){
        return {
            restrict: 'E',
            scope: {
                dataset: '='
            },
            link: function (scope, element, attrs) {

                var width = window.innerWidth,
                    height = window.innerHeight,
                    resolution = 2.5;

                var color = d3.scale.cubehelix().domain([0,100]).range([d3.hsl(-120, .6, 0), d3.hsl(60, .6, 1)]).clamp(true)

                var projection = d3.geo.mercator()
                    .translate([0, 0])
                    .scale(width / 2 / Math.PI);

                var x = d3.scale.linear()
                    .domain([0, width])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, height])
                    .range([height, 0]);

                var zoom = d3.behavior.zoom()
                    .x(x)
                    .y(y)
                    .scaleExtent([1, 20])
                    .on("zoom", move);

                var path = d3.geo.path()
                    .projection(projection);

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("background","white")
                    .append("g")
                    .attr("filter","url(#f1)")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .call(zoom)
                    .on("click",function(){
                        //if(activeFilter){
                            redirect()
                       // }
                    });

                var gBase = svg.append("g");
                var g = gBase.append("g")
                var gHex = gBase.append("g")

                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", -width / 2)
                    .attr("y", -height / 2)
                    .attr("width", width)
                    .attr("height", height)

                    //.on("click",redirect)
                function generateData(lon, lat){
                    var randomX = d3.random.normal(lon, 2),
                    randomY = d3.random.normal(lat, 2);

                    return d3.range(1000)
                        .map(function(x){
                            var coordinates = projection([randomX(), randomY()]);
                            //var coordinates = projection([-10, 0]);
                            return [coordinates[0], coordinates[1], Math.random()]
                            })
                }


                var data = []// generateData(20,20)
              //  var data = data.concat(generateData(0,50))
               // var data = data.concat(generateData(2,50))
               // var data = data.concat(generateData(5,50))
                //  var data = data.concat(generateData(30,50))

                var circles;

                d3.json("data/mapdata.json", function(error, world) {
                    g.append("path")
                        .datum(topojson.feature(world, world.objects.countries))
                        .attr("class", "land")
                        .attr("d", path)
                        .style("fill","#2F343B")
                        .style("fill-opacity",0.1)


                    g.append("path")
                        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
                        .attr("class", "boundary")
                        .attr("d", path)
                        .style("stroke",'#2F343B')// '#C77966')
                        .style("stroke-opacity",0.2)


                });

                var hexbin = d3.hexbin()
                    .radius(resolution);

                dataSet = hexbin(data)

                var scaleRange = {
                    ranges: [1,2,6,10,30,100],
                    current:1
                }

                var scale = 1
                var k = 1

                function inBounds(val){
                    // Checks and sets the zoom level
                    if(val < scaleRange.ranges[scaleRange.current] && val > scaleRange.ranges[scaleRange.current-1]){
                        return true
                    } else {
                        for(var i=0;i<scaleRange.ranges.length-1;i++){
                            if(val < scaleRange.ranges[i+1] && val > scaleRange.ranges[i]){
                                scaleRange.current = i+1
                            }
                        }
                        return false
                    }
                }

                var radius = resolution
                function move() {
                    // Only redraw when entering a new zoom level
                    // Always crop the data
                    // dataSet is the current data set

                    var t = d3.event.translate,
                        s = d3.event.scale

                     // t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
                      //t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));

                    zoom.translate(t);
                    gBase.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

                    var i = data.length

                    k++

                    console.debug(s)
                    if(!inBounds(s)){
                        radius  = resolution /s
                        hexbin = d3.hexbin().radius(radius);

                        dataSet = hexbin(data)
                        console.debug("BANG!")
                        console.debug("scale "+s)

                    }

                    dataTemp = cropData(dataSet)



                    d3.selectAll(".hexg").remove()

                    gHex.append("g").attr("class","hexg")
                        .selectAll(".hexagon")
                        .data(dataTemp)
                        .enter()
                        .append("path")
                        .attr("class","hexagon")
                        .attr("d", hexbin.hexagon(radius))
                        .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })
                        .style("fill", function(d) { return color(30 + d.length); })
                        .attr("fill-opacity",0.4);

                }



                function sortByLength(a,b){
                                return a.length > b.length ? -1 : 1
                }

                function calculateVote(v){
                                var len = v.length,
                                                sum = 0

                                var i = v.length;
                                while(i--){
                                                sum += v[i][2]
                                }
                                return sum/len
                }

                function updateVotes(d){
                                var i = d.length;
                                while(i--){
                                                d[i].vote = calculateVote(d[i])
                                }
                                return d
                }

                function cropData(d){

                    var i = d.length,
                        data = [],
                        xmin = -width/2,
                        xmax = width/2,
                        ymin = height / 2,// * ( s) + 230 * s, //height * (s-1),
                        ymax = height/2,
                        xval,
                        yval

                    while(i--){
                        if( d[i].x > xmin && d[i].x < xmax){ //} && d[i].y > ymin && d[i].y < ymax ){
                            data.push(d[i])
                        }
                    }
                    return data
                }

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
                                return d3.interpolate(a, 20);
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

                scope.$watch('dataset.length', function(newVal, oldVal){
                    //console.debug("NEW DATA "+(newVal !== oldVal))
                    if(newVal !== oldVal){
                        console.debug(newVal)
                        var data = scope.dataset.map(function(d){
                            var proj = projection([d.lon , d.lat]);
                            d.lat = proj[1];
                            d.lon = proj[0];
                            return d
                        })

                        g.append("g")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","dot")
                            .attr("cx", function(d){ return d.lon })
                            .attr("cy", function(d){ return d.lat })
                            .attr("r", 0)
                            .attr("fill", function(d){
                                return "rgb("+d.r+","+d.g+","+d.g+")" })
                            .attr("fill-opacity",0.5)
                            .transition()
                            .duration(2000)
                            .attr("r", function(d){ return 2*Math.sqrt(d.count/1) })
                    }
                })
            }
        }}
    ])