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

				    var nodes = [];

				    data.forEach(function (d) {
				    	nodes.push(d);
				    });

				    var force = d3.layout.force()
				    	.charge(function(d){return hashsize(d.velocity)*charge})
				    	.size([width,height]);




				    var circle = svg.selectAll("circle")
				    	.data(nodes)
				    	.enter().append("circle")
				    	.style("fill", "lightblue")
				    	.attr("height", 40)
				    	.attr("width", 75)
				    	.attr("class", function(d) {return d.name})
				    	.attr("r", function(d) {return hashsize(d.velocity)})
				    	.attr("cx", function(d) {return hashsize(d.velocity)})
    					.attr("cy", function(d) {return hashsize(d.velocity)});

    				force
     					.nodes(nodes)
       					.start();

					    //Need to set up nodes. (Copy from buzzmap).

					    //Set up lines (Copy from d3 example).

				}
			}
		}
	}]);