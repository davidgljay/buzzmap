
app.controller('list', function ($scope) {

});

app.controller('index', function ($scope, $http, $timeout) {

	var checkinfo = function (hashtag) {
			$http.get('/tags/' + hashtag ).success(function(res) {
			console.log(res);
			$scope.about = res.about;
			$scope.mapdata = res;
			$scope.$broadcast('rerender');
		}).error(function(err) {
			console.log(err);
			throw err;
		});
	};

	checkinfo('obama');

});




