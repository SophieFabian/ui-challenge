app.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', 'locator', function($scope, uiGmapGoogleMapApi, locator) {

	$scope.markers = locator.getLocations();

	uiGmapGoogleMapApi.then(function(maps) {
		maps.visualRefresh = true;

		$scope.map = {
				show: function(){ return $scope.markers.user !== undefined || $scope.markers.web !== undefined; },
				showTraffic: false,
				showBicycling: false,
				showWeather: false,
				showHeat: false,
				center: getCenter(),
				zoom: 6,
				dragging: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				markers: function(){
					return [ $scope.markers.user , $scope.markers.web ]
				},
				infoWindow: {
					options: {
						disableAutoPan: false
					},
					show: true
				}
		};
	});

	$scope.onMarkerClicked = function onMarkerClicked(marker) {
		marker.showWindow = true;
	};

	function getCenter(){
		var center = { latitude: 0, longitude: 0 };
		if ($scope.markers.user !== undefined && $scope.markers.web !== undefined){
			center.latitude = ($scope.markers.user.latitude + $scope.markers.web.latitude) / 2;
			center.longitude = ($scope.markers.user.longitude + $scope.markers.web.longitude) / 2;
		}else if ($scope.markers.user !== undefined && $scope.markers.web === undefined){
			center.latitude = $scope.markers.user.latitude;
			center.longitude = $scope.markers.user.longitude;
		}else if ($scope.markers.user === undefined && $scope.markers.web !== undefined){
			center.latitude = $scope.markers.web.latitude;
			center.longitude = $scope.markers.web.longitude;
		}
		console.log("Center: ",center);
		return center;
	};

}]);