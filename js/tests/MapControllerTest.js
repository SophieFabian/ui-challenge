'use strict';

// Global google variable that google maps API would provide,
// however for the unit tests, we are not waiting for the API to load. 
var google = { maps: { MapTypeId: { ROADMAP: "roadmap" } } };

describe('Controller: MapController', function(){
	beforeEach(module('GeoLocationApp'));

	var $scope;
	var locatorMock;
	var testMarkers = [	{	"latitude": 38.7932,
							"longitude": -77.5366 },
						{	"latitude": 39.76,
							"longitude": -98.5 }];

	beforeEach(inject(function($controller, $rootScope, $q){
		var deferred = $q.defer();
		var uiGmapGoogleMapApiMock = deferred.promise;
		$scope = {};
		locatorMock = {
			markers: [],
			getMarkers : function(){ return this.markers; },
			setUserLocation: function(location){ this.markers = [location]; },
			setWebLocation: function(location){ this.markers = [location]; },
			setBothLocations: function(location1,location2){ this.markers = [location1,location2]; }
		};

		$controller('MapController', { $scope: $scope, locator: locatorMock, uiGmapGoogleMapApi: uiGmapGoogleMapApiMock });
		deferred.resolve(google.maps);
		$rootScope.$digest();
	}));

	afterEach(function(){
		locatorMock.markers = [];
	});

	describe('$scope.onMarkerClicked',function(){
		it('sets the markers showWindow attribute to true',function(){
			testMarkers[0].showWindow = false;

			$scope.onMarkerClicked(testMarkers[0]);
			expect(testMarkers[0].showWindow).toBeTruthy();
		});
	});

	describe('$scope initial state', function(){
		it('variables are in their initial state after google maps has loaded', function(){

			expect($scope.map).toBeDefined();
			expect($scope.map.show()).toBeFalsy();
			expect($scope.map.showTraffic).toBeFalsy();
			expect($scope.map.showBicycling).toBeFalsy();
			expect($scope.map.showWeather).toBeFalsy();
			expect($scope.map.showHeat).toBeFalsy();
			expect($scope.map.center).toEqual({ latitude: 0, longitude: 0 });
			expect($scope.map.zoom).toBe(3);
			expect($scope.map.dragging).toBeTruthy();
			expect($scope.map.mapTypeId).toBe(google.maps.MapTypeId.ROADMAP);
			expect($scope.map.markers()).toEqual([]);
			expect($scope.map.infoWindow).toEqual(
				{	options: {
						disableAutoPan: false
					},
					show: true
				}
			);
		});;
	});

	describe('$scope.map',function(){
		it('shows the map if a marker is added', function(){

			locatorMock.setUserLocation(testMarkers[0]);
			expect($scope.map.show()).toBeTruthy();
		});

		it('hides the map if all markers are removed', function(){

			locatorMock.setUserLocation(testMarkers[0]);
			expect($scope.map.show()).toBeTruthy();
			locatorMock.markers = [];
			expect($scope.map.show()).toBeFalsy();
		});

		it('shows the markers as they are added', function(){

			locatorMock.setUserLocation(testMarkers[0]);
			expect($scope.map.markers().length).toBe(1);
			locatorMock.setWebLocation(testMarkers[1]);
			expect($scope.map.markers().length).toBe(1);
			locatorMock.markers = [];
			expect($scope.map.markers().length).toBe(0);
			locatorMock.setBothLocations(testMarkers[0],testMarkers[1]);
			expect($scope.map.markers().length).toBe(2);
		});
	});
});
