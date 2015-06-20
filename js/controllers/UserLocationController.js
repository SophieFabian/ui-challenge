app.controller('UserLocationController', ['$scope', 'locator', function($scope, locator) {

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

	$scope.getMyLocation = function getMyLocation(){
		locator.fn("http://ip-api.com/json/").success(function(data){
			$scope.userLocation.data = data;
			$scope.userLocation.empty = false;
			$scope.userLocation.help = $scope.help;
			$scope.userLocation.label = $scope.label;
			$scope.userLocation.order = $scope.order;

			locator.setUserLocation({
				latitude:data.lat,
				longitude:data.lon
			});
		});
	};

	$scope.resetLocationDetails = function resetLocationDetails(){
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
	};

	$scope.help = function(fieldName){
		alert("This is your " + fieldName + " from ISP " + $scope.userLocation.data.isp + " at " + new Date());
	};

	$scope.resetLocationDetails();

}]);