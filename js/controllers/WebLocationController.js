'use strict';

app.controller('WebLocationController', ['$scope', 'locator', function($scope, locator){

	$scope.locationError = "";
	$scope.locating = false;

	$scope.validate = function(){
		var regex = /^(www\.)?((\w)+\.){1,}((\w){2,4})$/;
		if(!regex.test($scope.host)){
			$scope.locationError = "Invalid website address!";
			return false;
		}else{
			$scope.locationError = "";
			return true;
		}
	}

	$scope.getWebLocation = function(){
		if($scope.locating || !$scope.validate()) return;

		$scope.locating = true;

		locator.locate("http://freegeoip.net/json/"+$scope.host)
			.then(function(result){
				$scope.webLocation = result;
				$scope.locationError = "";
				locator.setWebLocation({
					latitude:result.latitude,
					longitude:result.longitude
				});
				$scope.locating = false;

			}, function(err){
				$scope.webLocation = undefined;
				$scope.locationError = err;
				locator.setWebLocation(undefined);
				$scope.locating = false;
			});
	};

}]);
