app.controller('WebLocationController', ['$scope', 'locator', function($scope, locator) {

	$scope.locate = function locate(){
		locator.fn("http://freegeoip.net/json/"+$scope.host).success(function(data){
			$scope.webLocation = data;
			locator.setWebLocation({
				latitude:data.latitude,
				longitude:data.longitude
			});
		});
	};

}]);