angular.module('myApp.directives', [])
    .directive('geoVisualisation', ['appConfig','$location',function(appConfig, $location){
        return {
            restrict: 'E',
            scope: {
                dataset: '=',
                blur: '='
            },
            link: function (scope, element, attrs) {

                var width = window.innerWidth,
                    height = window.innerHeight,
                    resolution = 4,
                    offset = 0;

                var color = d3.scale.cubehelix()
                    .domain([30,140])
                    //.range(["#703030","#2F343B","#7E827A"])
                    .range([d3.hsl(-120, .6, 0), d3.hsl(60, .6, 1)])
                    //.clamp(true)



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
                    .scaleExtent([1, 3])
                    .on("zoom", move);

                var path = d3.geo.path()
                    .projection(projection);
                window.mousedata = []
                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height-offset)
                    .style("background","#ACCFCC")
                    .attr("filter","url(#f1)")
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height-offset) / 2 + ")")
                    .call(zoom)
                    .on("click",function(){
                        /*
                        var _m = d3.mouse(this);
                        console.debug(_m)
                        _m = projection.invert([(_m[0]), _m[1]])

                        //window.mousedata.push({lon: x.invert(_m[0]), lat: y.invert(_m[1]) })
                        //console.debug(_m);

                        //projection([d.lon , d.lat]);

                        xval = x.invert(_m[0])
                        yval = y.invert(_m[1])


                        gHex.append("circle")
                            .attr("class", "hexagon")
                            .attr("cx", xval)
                            .attr("cy", 0)
                            .attr("r", 20)
                            .style("fill", "#8A0917")
                            .attr("fill-opacity", 1);

                        //if(activeFilter){
                           // redirect()
                       // }
                       */
                    });

                var gBase = svg.append("g")
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

                function sortByLength(a,b){
                    return a.length > b.length ? -1 : 1
                }

                var data = []// generateData(20,20)
              //  var data = data.concat(generateData(0,50))
               // var data = data.concat(generateData(2,50))
               // var data = data.concat(generateData(5,50))
                //  var data = data.concat(generateData(30,50))

                var circles;

                d3.json("data/markers.json", function(error, d) {
                    data = [{"lon":-80.87475149105367,"lat":34.1083052979205},{"lon":-86.24254473161034,"lat":36.44511097175342},{"lon":-82.30616302186878,"lat":40.64133738865435},{"lon":-81.23260437375745,"lat":38.433830390519454},{"lon":-93.39960238568588,"lat":40.912324156412076},{"lon":-72.28628230616302,"lat":44.33406627804308},{"lon":-70.49701789264412,"lat":48.04789227574673},{"lon":-64.05566600397614,"lat":46.34602298046212},{"lon":-54.39363817097415,"lat":47.082081090467625},{"lon":-68.34990059642146,"lat":31.70512826125802},{"lon":-72.28628230616302,"lat":26.389913139014258},{"lon":-75.86481113320079,"lat":24.450808075323238},{"lon":-77.2962226640159,"lat":24.450808075323238},{"lon":-64.05566600397614,"lat":23.797615902617302},{"lon":-54.751491053677924,"lat":26.389913139014258},{"lon":-51.53081510934393,"lat":30.787310521018107},{"lon":-47.2365805168986,"lat":25.100631841877703},{"lon":-52.604373757455264,"lat":20.483576378387312},{"lon":-45.08946322067594,"lat":15.72330547099364},{"lon":-47.2365805168986,"lat":21.152551444962086},{"lon":-42.5844930417495,"lat":18.459389655716485},{"lon":-39.005964214711724,"lat":9.792922605370498},{"lon":-45.08946322067594,"lat":5.8941489624335865},{"lon":-53.32007952286282,"lat":15.72330547099364},{"lon":-61.192842942345926,"lat":17.779179795079255},{"lon":-65.84493041749504,"lat":8.733379658461043},{"lon":-58.3300198807157,"lat":4.468623854112479},{"lon":-57.61431411530815,"lat":-4.825299822684212},{"lon":-49.02584493041749,"lat":-12.6009502724686},{"lon":-40.079522862823055,"lat":-19.81167076507392},{"lon":-30.41749502982107,"lat":-17.779179795079283},{"lon":-40.079522862823055,"lat":-12.251481072910888},{"lon":-44.01590457256461,"lat":-6.960943648632921},{"lon":-33.28031809145129,"lat":-4.111774278237624},{"lon":-29.701789264413517,"lat":-9.440098882708773},{"lon":-22.902584493041747,"lat":-10.849094496007634},{"lon":-21.47117296222664,"lat":-8.733379658461056},{"lon":-28.628230616302183,"lat":-3.3976093923614474},{"lon":-22.54473161033797,"lat":0.8945958562416771},{"lon":-17.892644135188867,"lat":-2.682915634562157},{"lon":-20.755467196819083,"lat":2.325405065068761},{"lon":-19.681908548707753,"lat":9.792922605370498},{"lon":-28.628230616302183,"lat":16.411049423334905},{"lon":-28.628230616302183,"lat":8.37951034896337},{"lon":-13.956262425447315,"lat":-7.670818295979019},{"lon":-13.956262425447315,"lat":-5.181788453364996},{"lon":-8.23061630218688,"lat":-1.9678038851185031},{"lon":-12.16699801192843,"lat":0.536771472037555},{"lon":-3.220675944333996,"lat":3.0403217010624797},{"lon":2.504970178926441,"lat":3.0403217010624797},{"lon":-1.4314115308151092,"lat":-3.7547648592598013},{"lon":3.9363817097415503,"lat":-8.02531881017989},{"lon":2.147117296222664,"lat":-3.7547648592598013},{"lon":-3.220675944333996,"lat":-2.682915634562157},{"lon":-5.725646123260437,"lat":-9.792922605370498},{"lon":2.147117296222664,"lat":-12.94994362769048},{"lon":1.4314115308151092,"lat":-15.033229593074482},{"lon":-20.39761431411531,"lat":-15.723305470993628},{"lon":-25.765407554671967,"lat":-19.474643915636754},{"lon":-27.554671968190853,"lat":-23.469777791208116},{"lon":-23.260437375745525,"lat":-21.818517954677944},{"lon":-20.755467196819083,"lat":-23.469777791208116},{"lon":-20.39761431411531,"lat":-29.549823082467363},{"lon":-15.387673956262425,"lat":-26.389913139014272},{"lon":-18.60834990059642,"lat":-30.479398232411143},{"lon":-20.039761431411527,"lat":-30.479398232411143},{"lon":-15.387673956262425,"lat":-32.613952934898094},{"lon":-15.745526838966201,"lat":-29.86064854117843},{"lon":-17.534791252485086,"lat":-29.238038731197896},{"lon":-12.16699801192843,"lat":-34.69881359990794},{"lon":-8.588469184890656,"lat":-31.70512826125802},{"lon":-12.16699801192843,"lat":-24.1246288468147},{"lon":-3.220675944333996,"lat":-22.481399877481348},{"lon":-1.073558648111332,"lat":-19.81167076507392},{"lon":4.652087475149105,"lat":-16.75401846553042},{"lon":9.30417495029821,"lat":-14.340914314457853},{"lon":12.524850894632207,"lat":-18.119615036966717},{"lon":14.67196819085487,"lat":-19.81167076507392},{"lon":11.451292246520874,"lat":-24.450808075323227},{"lon":8.946322067594433,"lat":-25.747021422812168},{"lon":2.8628230616302184,"lat":-20.81843515171916},{"lon":-4.294234592445328,"lat":-27.34755811504283},{"lon":4.652087475149105,"lat":-27.664958821757008},{"lon":13.598409542743537,"lat":-19.81167076507392},{"lon":19.681908548707753,"lat":-17.779179795079283},{"lon":25.40755467196819,"lat":-12.251481072910888},{"lon":25.765407554671967,"lat":-20.81843515171916},{"lon":25.40755467196819,"lat":-26.389913139014272},{"lon":17.892644135188867,"lat":-30.78731052101813},{"lon":17.534791252485086,"lat":-24.450808075323227},{"lon":8.588469184890656,"lat":-26.389913139014272},{"lon":-1.7892644135188864,"lat":-31.70512826125802},{"lon":-4.652087475149105,"lat":-35.57672111377259},{"lon":5.009940357852882,"lat":-35.57672111377259},{"lon":3.578528827037773,"lat":-40.09605169809575},{"lon":11.451292246520874,"lat":-36.44511097175342},{"lon":13.240556660039761,"lat":-42.77818522864682},{"lon":20.39761431411531,"lat":-39.26986926128461},{"lon":15.745526838966201,"lat":-44.589471694755396},{"lon":26.838966202783297,"lat":-50.612434559235716},{"lon":19.681908548707753,"lat":-51.95524997152399},{"lon":44.01590457256461,"lat":-58.09413369892461},{"lon":31.491053677932403,"lat":-55.142532894516485},{"lon":29.34393638170974,"lat":-51.95524997152399},{"lon":33.28031809145129,"lat":-47.80810856926877},{"lon":30.05964214711729,"lat":-34.69881359990794},{"lon":46.52087475149105,"lat":-41.450977771979005},{"lon":31.13320079522863,"lat":-23.141123190557373},{"lon":-11.80914512922465,"lat":10.14537171921127},{"lon":-10.019880715705764,"lat":16.067474656477547},{"lon":-7.872763419483101,"lat":19.47464391563677},{"lon":-15.029821073558645,"lat":20.483576378387312},{"lon":-11.80914512922465,"lat":24.776145169674002},{"lon":-3.9363817097415503,"lat":13.29844885636671},{"lon":-7.514910536779323,"lat":17.779179795079255},{"lon":1.7892644135188864,"lat":13.993946254481218},{"lon":-0.7157057654075546,"lat":11.55116470515652},{"lon":-0.7157057654075546,"lat":9.792922605370498},{"lon":5.725646123260437,"lat":8.02531881017989},{"lon":9.30417495029821,"lat":2.6829156345621445},{"lon":11.80914512922465,"lat":0.178926150530721},{"lon":10.73558648111332,"lat":4.468623854112479},{"lon":12.16699801192843,"lat":10.849094496007622},{"lon":4.652087475149105,"lat":21.485915568046092},{"lon":2.8628230616302184,"lat":27.98144044272839},{"lon":-5.725646123260437,"lat":28.925301789991007},{"lon":-2.147117296222664,"lat":32.312019358136205},{"lon":-12.524850894632207,"lat":33.21477118734722},{"lon":-11.80914512922465,"lat":40.096051698095756},{"lon":-7.872763419483101,"lat":44.843759710779715},{"lon":-12.524850894632207,"lat":49.69532715377395},{"lon":-16.819085487077533,"lat":45.84973711518908},{"lon":-23.6182902584493,"lat":47.082081090467625},{"lon":-23.260437375745525,"lat":48.524127121733564},{"lon":-14.314115308151091,"lat":55.952281590483885},{"lon":8.946322067594433,"lat":59.575400292147165},{"lon":6.083499005964215,"lat":56.548696443944166},{"lon":17.892644135188867,"lat":56.548696443944166},{"lon":18.966202783300197,"lat":25.100631841877703},{"lon":27.196819085487075,"lat":19.136914565138415},{"lon":40.79522862823062,"lat":12.251481072910888},{"lon":31.84890656063618,"lat":8.37951034896337},{"lon":24.691848906560633,"lat":13.646453765751183},{"lon":25.765407554671967,"lat":3.754764859259789},{"lon":23.260437375745525,"lat":-5.538076051793806},{"lon":22.18687872763419,"lat":-6.960943648632921},{"lon":22.18687872763419,"lat":-7.670818295979019}];
                    console.debug(data)
                    var _d = data.map(function(d){
                        var proj = projection([d.lon , d.lat]);
                        d.lat = proj[1];
                        d.lon = proj[0];
                        return {lon:proj[0], lat:proj[1]}//, (d.r+","+ d.g+","+ d.b)]
                    });

                    var circles = gHex
                        .selectAll("circle")
                        .data(_d)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) { return d.lon })
                        .attr("cy", function (d) { return d.lat })
                        .style("fill", "#8A0917")//function(d) { return color(30 + Math.sqrt(d.length)); })
                        .attr("fill-opacity", 0)
                        .attr("r", 5)
                })

                d3.json("data/mapdata.json", function(error, world) {
                    g.append("path")
                        .datum(topojson.feature(world, world.objects.countries))
                        .attr("class", "land")
                        .attr("d", path)
                        .style("fill","#FFFFFF")//"#2F343B")
                        //.style("fill-opacity",1)


                    g.append("path")
                        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
                        .attr("class", "boundary")
                        .attr("d", path)
                        .style("stroke",'#2F343B')// '#C77966')
                        .style("stroke-opacity",0.2)


                });

                var hexbin = d3.hexbin().radius(resolution);

                dataSet = hexbin(data).sort(sortByLength);

                opacity = d3.scale.linear()
                    .domain([0,1])
                    .range([0,1]);

                var scaleRange = {
                    ranges: [1,2,6,15,100],
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
                                radius  = resolution/scaleRange.ranges[i];
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

                    t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
                    t[1] = Math.min(height / 2 * (s - 1), Math.max(height / 2 * (1 - s), t[1]));

                    zoom.translate(t);
                    gBase.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

                    var i = data.length

                    k++

                    //console.debug(s)
                    if(!inBounds(s)){
                        //
                        hexbin = d3.hexbin().radius(radius);

                        dataSet = hexbin(data).sort(sortByLength);
                        dataTemp = cropData(dataSet);
                        //console.debug("BANG!")
                        //console.debug("scale "+s)

                        opacity = d3.scale.linear()
                            .domain([0,dataSet[0].length])
                            .range([0,1]);

                        draw(dataTemp)


/*

                        gHex.append("g").attr("class", "hexg")
                            .selectAll(".hexagon")
                            .data(dataTemp)
                            .enter()
                            .append("path")
                            .attr("class", "hexagon")
                            .attr("d", function (d) {
                                return hexbin.hexagon(radius * (0.7 +  opacity(d.length)))
                            })
                            .attr("transform", function (d) {
                                return "translate(" + (d.x) + "," + (d.y) + ")";
                            })
                            .style("fill", function(d) { return color(30 + Math.sqrt(d.length)); })
                            .attr("fill-opacity", function (d) {
                                return 0.2 + 0.3 * opacity(d.length)
                            }); //0.4);
*/
                    }

                    //


                    //if(!inBounds(s)) {

                    //}
                }

                function draw(data, conf){

                    d3.selectAll(".hexg").remove();

                    var circles = gHex.append("g")
                        .attr("class", "hexg")
                        .selectAll(".hexagon")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("class", "hexagon")
                        .attr("cx", function (d) { return d.x })
                        .attr("cy", function (d) { return d.y })
                        .style("fill", "#8A0917")//function(d) { return color(30 + Math.sqrt(d.length)); })
                        .attr("fill-opacity", 0.7)

                    if(conf && conf.animate === true){
                        circles
                            .attr("r",  0)
                            .transition()
                            .duration(2000)
                            .attr("r", function (d) { return radius*(0.2 + 1.7*Math.sqrt(opacity(d.length))) })
                    } else {
                        circles.attr("r", function (d) { return radius*(0.2 + 1.7*Math.sqrt(opacity(d.length))) })
                    }
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
                        //$location.path("/view2")
                        //scope.$apply()

                        d3.select("#blur")
                            .transition()
                            .duration(1000)
                            .ease("linear")
                            .attrTween("stdDeviation", function (d, i, a) {
                                return d3.interpolate(a, 20);
                            });
                    } else {
                        activeFilter = false;
                        //$location.path("/home")
                        //scope.$apply()

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

                scope.$watch('blur', function(newVal, oldVal){
                    console.debug("BLUR")
                    if(newVal !== oldVal){
                        redirect()

                    }
                })

                scope.$watch('dataset.length', function(newVal, oldVal){
                    //console.debug("NEW DATA "+(newVal !== oldVal))
                    if(newVal !== oldVal){
                        //console.debug(newVal)
                        //var temp = [ {lat:36, lon: 138}, {lat:1.3667, lon: 103.8}, {lat:37, lon: 127.5}, {lat:23.5, lon: 121}, {lat:35, lon: 105}, {lat:22.25, lon: 114.1667}, {lat:2.5, lon: 112.5}, {lat:-27, lon: 133}, {lat:15, lon: 100}, {lat:38, lon: -97}, {lat:60, lon: -95}, {lat:23, lon: -102}, {lat:17.3333, lon: -62.75}, {lat:18.25, lon: -66.5}, {lat:12.1167, lon: -61.6667}, {lat:18.25, lon: -77.5}, {lat:32.3333, lon: -64.75}, {lat:47, lon: 8}, {lat:51, lon: 9}, {lat:52.5, lon: 5.75}, {lat:47.3333, lon: 13.3333}, {lat:54, lon: -2}, {lat:60, lon: 100}, {lat:39, lon: 22}, {lat:46, lon: 2}, {lat:64, lon: 26}, {lat:49.75, lon: 15.5}, {lat:56, lon: 24}, {lat:50.8333, lon: 4}, {lat:57, lon: 25}, {lat:42.8333, lon: 12.8333}, {lat:56, lon: 10}, {lat:49.75, lon: 6.1667}, {lat:43.9333, lon: 12.4667}, {lat:43, lon: 25}, {lat:40, lon: -4}, {lat:48.6667, lon: 19.5}, {lat:59, lon: 26}, {lat:48, lon: 68}, {lat:53, lon: -8}, {lat:52, lon: 20}, {lat:46, lon: 25}, {lat:62, lon: 15}, {lat:46, lon: 15}, {lat:65, lon: -18}, {lat:62, lon: 10}, {lat:49, lon: 32}, {lat:25, lon: 45}, {lat:40, lon: 45}, {lat:35, lon: 33}, {lat:44, lon: 21}, {lat:45.1667, lon: 15.5}, {lat:39, lon: 35}, {lat:31.5, lon: 34.75}, {lat:53, lon: 28}, {lat:47, lon: 20}, {lat:47, lon: 29}, {lat:39.5, lon: -8}, {lat:-41, lon: 174}, {lat:47.1667, lon: 9.5333}, {lat:24, lon: 54}, {lat:41, lon: 75}, {lat:32, lon: 53}, {lat:26, lon: 50.55}, {lat:33.8333, lon: 35.8333}, {lat:32, lon: 35.25}, {lat:-5, lon: 120}, {lat:16, lon: 106}, {lat:-6, lon: 147}, {lat:20, lon: 77}, {lat:13, lon: 122}, {lat:-18, lon: 175}, {lat:28, lon: 84}, {lat:30, lon: 70}, {lat:24, lon: 90}, {lat:13, lon: 105}, {lat:-15, lon: -140}, {lat:7, lon: 81}, {lat:-16, lon: 167}, {lat:-13.5833, lon: -172.3333}, {lat:-19.0333, lon: -169.8667}, {lat:18, lon: 105}, {lat:-29.0333, lon: 167.95}, {lat:4.5, lon: 114.6667}, {lat:46, lon: 105}, {lat:22.1667, lon: 113.55}, {lat:-10, lon: -55}, {lat:-10, lon: -76}, {lat:19, lon: -70.6667}, {lat:-30, lon: -71}, {lat:-34, lon: -64}, {lat:-23, lon: -58}, {lat:-33, lon: -56}, {lat:10, lon: -84}, {lat:8, lon: -66}, {lat:21.5, lon: -80}, {lat:15.5, lon: -90.25}, {lat:9, lon: -80}, {lat:19, lon: -72.4167}, {lat:-17, lon: -65}, {lat:4, lon: -72}, {lat:12.25, lon: -68.75}, {lat:12.1861, lon: -68.9894}, {lat:-2, lon: -77.5}, {lat:21, lon: 57}, {lat:25.5, lon: 51.25}, {lat:35.8333, lon: 14.5833}, {lat:-29, lon: 24}, {lat:27, lon: 30}, {lat:15, lon: 30}, {lat:1, lon: 38}, {lat:-6, lon: 35}, {lat:-20.2833, lon: 57.55}, {lat:-12.5, lon: 18.5}, {lat:6, lon: 12}, {lat:10, lon: 8}, {lat:14, lon: -14}, {lat:32, lon: -5}, {lat:11.5, lon: 43}, {lat:-20, lon: 30}, {lat:17, lon: -4}, {lat:8, lon: -5}, {lat:-4.5833, lon: 55.6667}, {lat:9.5, lon: 2.25}, {lat:-26.5, lon: 31.5}, {lat:28, lon: 3}, {lat:34, lon: 9}, {lat:-18.25, lon: 35}, {lat:-20, lon: 47}, {lat:8, lon: -2}, {lat:-22, lon: 17}, {lat:8.5, lon: -11.5}, {lat:1, lon: 32}, {lat:-15, lon: 30}, {lat:-2, lon: 30}, {lat:-29.5, lon: 28.5}, {lat:-22, lon: 24}, {lat:-13.5, lon: 34}, {lat:0, lon: 25}, {lat:13, lon: -2}, {lat:-1, lon: 15}, {lat:13.4667, lon: -16.5667}, {lat:-3.5, lon: 30}, {lat:33, lon: 65}, {lat:-8, lon: 178}, {lat:-20, lon: -175}, {lat:22, lon: 98}, {lat:-21.5, lon: 165.5}, {lat:-8.57, lon: 125.57}, {lat:3.25, lon: 73}, {lat:13.4667, lon: 144.7833}, {lat:-9, lon: -172}, {lat:-14.3333, lon: -170}, {lat:27.5, lon: 90.5}, {lat:-0.5333, lon: 166.9167}, {lat:7.5, lon: 134.5}, {lat:9, lon: 168}, {lat:-8, lon: 159}, {lat:1.4167, lon: 173}, {lat:6.9167, lon: 158.25}, {lat:-21.2333, lon: -159.7667}, {lat:13.25, lon: -61.2}, {lat:13.1667, lon: -59.5333}, {lat:19.5, lon: -80.5}, {lat:16.25, lon: -61.5833}, {lat:15.4167, lon: -61.3333}, {lat:18.3333, lon: -64.8333}, {lat:18.25, lon: -63.1667}, {lat:24.25, lon: -76}, {lat:17.9, lon: -62.8333}, {lat:13, lon: -85}, {lat:11, lon: -61}, {lat:13.8333, lon: -88.9167}, {lat:5, lon: -59}, {lat:17.25, lon: -88.75}, {lat:15, lon: -86.5}, {lat:12.5, lon: -69.9667}, {lat:12.2461, lon: -68.427}, {lat:4, lon: -53}, {lat:4, lon: -56}, {lat:44, lon: 18}, {lat:41.8333, lon: 22}, {lat:31, lon: 36}, {lat:29.3375, lon: 47.6581}, {lat:35, lon: 38}, {lat:72, lon: -40}, {lat:40.5, lon: 47.5}, {lat:33, lon: 44}, {lat:54.23, lon: -4.57}, {lat:41, lon: 20}, {lat:42, lon: 19}, {lat:41, lon: 64}, {lat:42, lon: 43.5}, {lat:41.9, lon: 12.45}, {lat:49.43, lon: -2.58}, {lat:39, lon: 71}, {lat:36.1833, lon: -5.3667}, {lat:49.18, lon: -2.1}, {lat:62, lon: -7}, {lat:15, lon: 48}, {lat:14.6667, lon: -61}, {lat:42.5, lon: 1.5}, {lat:25, lon: 17}, {lat:40, lon: 60}, {lat:11, lon: -10}, {lat:-21.1, lon: 55.6}, {lat:-1, lon: 11.75}, {lat:15, lon: 19}, {lat:4.85, lon: 31.6}, {lat:10, lon: 49}, {lat:2, lon: 10}, {lat:16, lon: 8}, {lat:12, lon: -15}, {lat:6.5, lon: -9.5}, {lat:20, lon: -12}, {lat:1, lon: 7} ]                        //var _d = scope.dataset.map(function(d){

                        var _d = scope.dataset.map(function(d){
                            var proj = projection([d.lon , d.lat]);
                            d.lat = proj[1];
                            d.lon = proj[0];
                            return [proj[0], proj[1] ] //, (d.r+","+ d.g+","+ d.b)]
                        })
                        //window.dataSet = _d
                        data = _d
                        dataSet = hexbin(data).sort(sortByLength);
                        opacity = d3.scale.linear()
                            .domain([0,dataSet[0].length])
                            .range([0,1]);
                        draw(dataSet, {animate: true})
                        /*
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
                            */
                    }
                })
            }
        }}
    ])