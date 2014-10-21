angular.module('myApp.directives')
    .directive('barChart', ['appConfig',function(appConfig){
        return {
            restrict: 'E',
            scope: {
                width:'=',
                height: '='
            },
            link: function (scope, element, attrs) {

                var svg = d3.select(element[0])
                    .append("svg")
                    //.attr("width", window.innerWidth)
                    //.attr("height", window.innerHeight)

                function startAnimation(w,h){
                    // https://color.adobe.com/Vintage-Ralph-Lauren-color-theme-2216979/edit/?copy=true
                    /*
                     703030
                     2F343B
                     7E827A
                     E3CDA4
                     C77966
                     */

                    var xLeft = 0,
                        yTop = 0,
                        padding = 20

                    var ebolaStats = [
                        {cases: 41, month: "February"},
                        {cases: 86, month: "April"},
                        {cases: 186, month: "March"},
                        {cases: 247, month: "May"},
                        {cases: 433, month: "June"},
                        {cases: 800, month: "July"},
                        {cases: 1293, month: "August"},
                        {cases: 3525, month: "September"},
                        {cases: 7500, month: "October"},
                        {cases: 20000, month: "November?"},
                        {cases: 40000, month: "December?"}
                    ]

                    var animateG = svg.append("g");
                    var rectG = animateG.append("g");

                    var MonthText = animateG.append("text")
                        .text("")
                        .attr("class","headertext")
                        .attr("x",0)
                        .attr("y",h-70)
                        .style("fill","#2F343B");

                    var CaseText = animateG.append("text")
                        .text("")
                        .attr("class","headertext")
                        .attr("x",0)
                        .attr("y",h-5)
                        .style("fill","#703030");

                    var count = 0,
                        rects = []

                    function next(){

                        var y = d3.scale.linear()
                            .domain([0,ebolaStats[count].cases])
                            .range([0,h-130])

                        for(var i=0;i<rects.length;i++){
                            rects[i]
                                .transition()
                                .duration(1500)
                                .attr("x", xLeft+i*w/(rects.length+1))
                                .attr("y", y(ebolaStats[count].cases)-y(ebolaStats[i].cases))
                                .attr("height", y(ebolaStats[i].cases) )
                                .attr("width", w/(rects.length+1)-4)
                        }

                        rects.push(
                            rectG.append("rect")
                                .attr("x", xLeft+w-w/(rects.length+1))
                                .attr("y", 0)//y(ebolaStats[count].cases))
                                .attr("rx",3)
                                .attr("ry",3)
                                .attr("height", y(ebolaStats[count].cases) )
                                .attr("width", w/(rects.length+1)-4)
                                .attr("fill","#2F343B")
                            //.attr("stroke","#2F343B")
                            // .attr("stroke-width",4)
                        )

                        MonthText.text(ebolaStats[count].month)

                        if(count>ebolaStats.length-4){
                            CaseText.text(ebolaStats[count].cases+" cases?")
                        } else {
                            CaseText.text(ebolaStats[count].cases+" cases")
                        }

                        count++;
                        if(count<ebolaStats.length){
                            setTimeout(next, 1500);
                        }
                    }
                    next()
                }

                function watchFunc(){
                    return scope.width + scope.height
                };

                scope.$watch(watchFunc, function(newVal, oldVal){
                    //if(newVal !== oldVal){

                        svg.attr("width", scope.width)
                           .attr("height", scope.height)

                        startAnimation(scope.width, scope.height)
                    //}
                })

            }
        }}
    ])