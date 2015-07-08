var app = angular.module('GeoLocationApp', ['uiGmapgoogle-maps']);

app.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
		GoogleMapApi.configure({
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});
	}]);

app.value('showModal', { value: false });
