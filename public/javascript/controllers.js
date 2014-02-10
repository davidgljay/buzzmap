
app.controller('list', function ($scope) {

});

app.controller('index', function ($scope) {
	$scope.stuff = 'things';
	$scope.authors = [{name:'sally'}, {name:'sam'}];
	$scope.tweets = [{text:'gametime'}, {text:'airplane time'}];
	$scope.mapdata = {nodes: [{name:'stuff', velocity:20}, {name: 'things', velocity: 50}], links:[{source:0, target:1}, {source:1, target:0}]};

});




