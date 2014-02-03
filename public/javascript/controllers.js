
app.controller('list', function ($scope) {

});

app.controller('index', function ($scope) {
	$scope.stuff = 'things';
	$scope.authors = [{name:'sally'}, {name:'sam'}];
	$scope.tweets = [{text:'gametime'}, {text:'airplane time'}];
	$scope.mapdata = [{name:'stuff', velocity:20}, {name: 'things', velocity: 50}];
});




