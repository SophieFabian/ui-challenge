var app = angular.module('GeoLocationApp', ['uiGmapgoogle-maps'])
	.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
		GoogleMapApi.configure({
			//key: 'your api key',
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});
	}]);
