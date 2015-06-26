'use strict';

app.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', 'locator', function($scope, uiGmapGoogleMapApi, locator){

	uiGmapGoogleMapApi.then(function(maps){
		maps.visualRefresh = true;

		$scope.map = {
				show: function(){ return locator.getMarkers().length > 0 },
				showTraffic: false,
				showBicycling: false,
				showWeather: false,
				showHeat: false,
				center: { latitude: 0, longitude: 0 },
				zoom: 3,
				dragging: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				markers: function(){ return locator.getMarkers(); },
				infoWindow: {
					options: {
						disableAutoPan: false
					},
					show: true
				}
		};
	});

	$scope.onMarkerClicked = function(marker){
		marker.showWindow = true;
	};

}]);
