'use strict';

app.controller('UserLocationController', ['$scope', 'locator', function($scope, locator){

	$scope.label = {
			query: "IP",
			country: "Country",
			regionName: "Region",
			city: "City",
			timezone: "Time Zone",
			lat: "Latitude",
			lon: "Longitude"
	};

	$scope.order = ["query","country","regionName","city","timezone","lat","lon"];

	$scope.locationError = "";
	$scope.locating = false;

	$scope.getMyLocation = function(){
		if($scope.locating) return;

		$scope.locating = true;

		locator.locate("http://ip-api.com/json/")
			.then(function(result){
				$scope.userLocation.data = result;
				$scope.userLocation.empty = false;
				$scope.userLocation.help = $scope.help;
				$scope.userLocation.label = $scope.label;
				$scope.userLocation.order = $scope.order;
				$scope.locationError = "";

				locator.setUserLocation({
					latitude:result.lat,
					longitude:result.lon
				});
				$scope.locating = false;

			}, function(err){
				$scope.resetLocationDetails();
				$scope.locationError = err;
				$scope.locating = false;
			});
	};

	$scope.resetLocationDetails = function(){
		$scope.userLocation = {
				data: {
					query: "0.0.0.0",
					country: "",
					regionName: "",
					city: "",
					timezone: "",
					lat: "",
					lon: "",
				},
				empty: true,
				help: $scope.help,
				label: $scope.label,
				order: $scope.order
		};
		locator.setUserLocation(undefined);
		$scope.locationError = "";
		$scope.locating = false;
	};

	$scope.help = function(fieldName){
		alert("This is your " + fieldName + " from ISP " + $scope.userLocation.data.isp + " at " + new Date().format());
	};

	$scope.resetLocationDetails();

}]);
