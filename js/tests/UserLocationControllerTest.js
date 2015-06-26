'use strict';

describe('Controller: UserLocationController', function(){
	beforeEach(module('GeoLocationApp'));

	var $http;
	var $scope;
	var $controller;
	var controller;
	var locatorMock;
	var initialUserLocationData = {
		query: "0.0.0.0",
		country: "",
		regionName: "",
		city: "",
		timezone: "",
		lat: "",
		lon: "",
	};

	beforeEach(inject(function(_$controller_, _$http_, $q){
		$controller = _$controller_;
		$http = _$http_;
		$scope = {};
		locatorMock = {
			locate: function(host){
						var deferred = $q.defer();
						$http.get(host)
							.success(function(result){
								deferred.resolve(result);
							})
							.error(function(err){
								deferred.reject(err);
							});
						return deferred.promise;
			},
			setUserLocation: function(location){ return; }
		};
		controller = $controller('UserLocationController', { $scope: $scope, locator: locatorMock });
	}));

	describe('$scope initial state', function(){
		it('variables are in their initial state', function(){

			expect($scope.order).toEqual(["query","country","regionName","city","timezone","lat","lon"]);
			expect($scope.label).toEqual({
				query: "IP",
				country: "Country",
				regionName: "Region",
				city: "City",
				timezone: "Time Zone",
				lat: "Latitude",
				lon: "Longitude"
			});
			expect($scope.userLocation.data).toEqual(initialUserLocationData);
			expect($scope.userLocation.empty).toBeTruthy();
			expect($scope.userLocation.help).toEqual($scope.help);
			expect($scope.userLocation.label).toEqual($scope.label);
			expect($scope.userLocation.order).toEqual($scope.order);
			expect($scope.locationError).toBe("");
			expect($scope.locating).toBeFalsy();
		});;
	});

	describe('$scope.getMyLocation', function(){
		var $httpBackend,locator,requestHandler;
		var userLocation = {
				"city":"Manassas",
				"country":"United States",
				"isp":"Leaseweb USA",
				"lat":38.7932,
				"lon":-77.5366,
				"query":"199.115.114.220",
				"regionName":"Virginia",
				"timezone":"America/New_York"
		};

		beforeEach(inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			requestHandler = $httpBackend
				.when('GET', 'http://ip-api.com/json/')
				.respond(userLocation);
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('returns if its currently locating the user', function(){
			$scope.locating = true;
			spyOn(locatorMock, 'locate').and.callThrough();

			$scope.getMyLocation();
			expect(locatorMock.locate).not.toHaveBeenCalled()
		});

		it('sets the "locating" variable to true during the http request', function(){

			expect($scope.locating).toBeFalsy();
			$scope.getMyLocation();
			expect($scope.locating).toBeTruthy();
			$httpBackend.flush();
			expect($scope.locating).toBeFalsy();
		});

		it('calls the locator with the right link', function(){
			spyOn(locatorMock, 'locate').and.callThrough();

			$scope.getMyLocation();
			$httpBackend.flush();
			expect(locatorMock.locate).toHaveBeenCalledWith("http://ip-api.com/json/");
		});

		it('stores the userLocation if it finds it', function(){

			$scope.getMyLocation();
			$httpBackend.flush();
			expect($scope.userLocation.data).toEqual(userLocation);
		});

		it('sets the rest of userLocation upon success', function(){

			$scope.getMyLocation();
			$httpBackend.flush();
			expect($scope.userLocation.empty).toBeFalsy();
			expect($scope.userLocation.help).toEqual($scope.help);
			expect($scope.userLocation.label).toEqual($scope.label);
			expect($scope.userLocation.order).toEqual($scope.order);
		});

		it('sets the userLocation on the locator if the user is found', function(){
			spyOn(locatorMock, 'setUserLocation').and.callThrough();

			$scope.getMyLocation();
			$httpBackend.flush();
			expect(locatorMock.setUserLocation).toHaveBeenCalledWith({ "latitude": 38.7932, "longitude": -77.5366 });
		});

		it('sets the locationError if the user cannot be located', function(){
			requestHandler.respond(500, 'Some error message');

			$scope.getMyLocation();
			$httpBackend.flush();
			expect($scope.locationError).toBe('Some error message');
		});

		it('calls resetLocationDetails if the user cannot be located', function(){
			requestHandler.respond(404, 'Some error message');
			spyOn($scope,'resetLocationDetails');

			$scope.getMyLocation();
			$httpBackend.flush();
			expect($scope.resetLocationDetails).toHaveBeenCalled();
		});
	});

	describe('$scope.resetLocationDetails', function(){
		it('resets the userLocation object to it\'s initial state',function(){
			$scope.userLocation = { "modified": "object" };

			$scope.resetLocationDetails();
			expect($scope.userLocation.data).toEqual(initialUserLocationData);
			expect($scope.userLocation.empty).toBeTruthy();
			expect($scope.userLocation.help).toEqual($scope.help);
			expect($scope.userLocation.label).toEqual($scope.label);
			expect($scope.userLocation.order).toEqual($scope.order);
		});

		it('resets locationError and locating variables', function(){
			$scope.locationError = "dirty";
			$scope.locating = "dirty";

			$scope.resetLocationDetails();
			expect($scope.locationError).toBe("");
			expect($scope.locating).toBeFalsy();
		});

		it('unsets the userLocation on the locator', function(){
			spyOn(locatorMock, 'setUserLocation').and.callThrough();

			$scope.resetLocationDetails();
			expect(locatorMock.setUserLocation).toHaveBeenCalledWith(undefined);
		});
	});

	describe('$scope.help', function(){
		it('alerts the user with a \'help\' message', function(){
			spyOn(window, 'alert');
			$scope.userLocation.data.isp = "fakeISP";

			$scope.help("IP");
			expect(window.alert).toHaveBeenCalledWith("This is your IP from ISP fakeISP at " + new Date().format());
		});
	});
});
