//Director for displaying twitter graph data of the form:
//[{hashtag: velocity, rel: overlap}]
//Where the first element in the array is the hashtag being requested.

angular.module('d3Display', ['d3'])
	.directive('buzzgraph', ['d3Service', function(d3Service) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
	          	var svg = d3.select(element[0])
        		.append("svg")
        		.style('width', '100%')
        		.append('g');

        		// Watch for a browser resize and redraw
		        window.onresize = function() {
		            scope.$apply();
		        };

		        scope.$watch(function() {
		            return angular.element().innerWidth;
		        }, function() {
		            scope.render(scope.mapdata);
		          });


		        scope.render = function(data) {

		        //Clear in case of rerender
		          	svg.selectAll('*').remove();

		        // If we don't pass any data, return out of the element
    				if (!data) return;

    				var margin = {top: 20, right: 20, bottom: 30, left: 50},
    				width = 960 - margin.left - margin.right,
    				height = 500 - margin.top - margin.bottom,
    				charge = -300;

					var hashsize = d3.scale.linear()
					.domain([0,50])
				    .range([0, 20]);

				    var linelength = d3.scale.linear()
				    .domain([0,50])
				    .range([0,40]);

				    var nodes = [],
				    links = [];

				    data.nodes.forEach(function (d) {
				    	nodes.push(d);
				    });

				    data.links.forEach(function (d) {
				    	links.push(d)
				    });

				   var force = d3.layout.force()
				    .nodes(nodes)
				    .links(links)
				    .on("tick", function(nodes) {
					    text.attr("x", function(d) { return d.x; })
         					.attr("y", function(d) { return d.y; });
					    circle.attr("cx", function(d) { return d.x; })
         					.attr("cy", function(d) { return d.y; });
         				link.attr("x1", function(d) { return d.source.x; })
        					.attr("y1", function(d) { return d.source.y; })
        					.attr("x2", function(d) { return d.target.x; })
        					.attr("y2", function(d) { return d.target.y; });
    					})
				    .size([width, height])
				    .charge(-800)
				    .start();

    				var link = svg.selectAll("line")
   						.data(links)
  						.enter().append("line")
      					.attr("class", "link")
      					.style("stroke-width", "5")
      					.style("stroke", "black");

				    var circle = svg.selectAll("circle")
				    	.data(nodes)
				    	.enter().append("circle")
				    	.style("fill", "lightblue")
				    	.attr("height", 40)
				    	.attr("width", 75)
				    	.style("z-index", 10)
				    	.attr("class", function(d) {return d.name})
				    	.attr("r", function(d) {return hashsize(d.velocity)})
				    	.attr("cx", function(d) {return (d.velocity + width/2)})
    					.attr("cy", function(d) {return (d.velocity + height/2)});

					var text = svg.selectAll("text")
					    .data(nodes)
					    .enter()
					    .append("text")
					    .attr("text-anchor", "middle")
					    .attr("font-size", 12)
					    .attr("class", function(d){return d.name})
					    .attr("x", function(d){return d.velocity + width/2})
					    .attr("y", function(d){return d.velocity + height/2})
					    .text(function(d){return d.name});





				}
			}
		}
	}]);