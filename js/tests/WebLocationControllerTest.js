'use strict';

describe('Controller: WebLocationController', function(){
	beforeEach(module('GeoLocationApp'));

	var $scope;
	var locatorMock;
	var webHistoryMock;

	beforeEach(inject(function($rootScope, $controller, $http, $q){
		$scope = $rootScope;
		$scope.recalledHost = "";
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
			setWebLocation: function(location){ return; },
			getRecalledHost: function(){ return $scope.recalledHost; }
		};
		webHistoryMock = {
			addTo: function(){ return; }
		};
		$controller('WebLocationController', { $scope: $scope, locator: locatorMock, webHistory: webHistoryMock });
	}));

	describe('$scope initial state', function(){
		it('variables are in their initial state', function(){

			expect($scope.locationError).toBe("");
			expect($scope.locating).toBeFalsy();
			expect($scope.host).toBe(locatorMock.getRecalledHost());
			expect($scope.webLocation).toBeUndefined();
		});
	});

	describe('$scope.validate', function(){
		it('decides if the input website is valid', function(){

			$scope.host = 'invalid';
			expect($scope.validate()).toBeFalsy();
			$scope.host = 'www.invalid';
			expect($scope.validate()).toBeFalsy();
			$scope.host = 'valid.com';
			expect($scope.validate()).toBeTruthy();
			$scope.host = 'v-a-l-i-d.com';
			expect($scope.validate()).toBeTruthy();
			$scope.host = 'www.valid.com';
			expect($scope.validate()).toBeTruthy();
			$scope.host = 'http://www.invalid.com';
			expect($scope.validate()).toBeFalsy();
			$scope.host = 'www.invalid.com/route';
			expect($scope.validate()).toBeFalsy();
			$scope.host = 'www.invalid.com/page.html';
			expect($scope.validate()).toBeFalsy();
			$scope.host = 'www.invalid.com/page.html?param=1';
			expect($scope.validate()).toBeFalsy();
		});

		it('sets the locationError for invalid websites only', function(){
			$scope.host = 'www.invalid';
			$scope.validate();

			expect($scope.locationError).toBe('Invalid website address!');

			$scope.host = 'valid.com';
			$scope.validate();

			expect($scope.locationError).toBe('');
		});
	});

	describe('$scope.getWebLocation', function(){
		var $httpBackend;
		var googleLocation = {
				"ip":"2607:f8b0:4006:80e::200e",
				"country_code":"US",
				"country_name":"United States",
				"latitude":39.76,
				"longitude":-98.5,
				"host": "google.com"
		};

		beforeEach(inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			$httpBackend
				.when('GET', 'http://freegeoip.net/json/google.com')
				.respond(googleLocation);
			$httpBackend
				.when('GET', 'http://freegeoip.net/json/le.com')
				.respond(404, '404 page not found');
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('calls the validate function', function(){
			spyOn($scope, 'validate');

			$scope.getWebLocation();
			expect($scope.validate).toHaveBeenCalled();
		});

		it('returns if the validation fails', function(){
			$scope.host = "invalid";
			spyOn(locatorMock, 'locate').and.callThrough();

			$scope.getWebLocation();
			expect($scope.locating).toBeFalsy();
			expect(locatorMock.locate).not.toHaveBeenCalled()
		});

		it('returns if its currently locating a website', function(){
			$scope.locating = true;
			spyOn(locatorMock, 'locate').and.callThrough();

			$scope.getWebLocation();
			expect(locatorMock.locate).not.toHaveBeenCalled()
		});

		it('sets the "locating" variable to true during the http request', function(){
			$scope.host = 'google.com';

			expect($scope.locating).toBeFalsy();
			$scope.getWebLocation();
			expect($scope.locating).toBeTruthy();
			$httpBackend.flush();
			expect($scope.locating).toBeFalsy();
		});

		it('calls the locator with the host', function(){
			$scope.host = 'google.com';
			spyOn(locatorMock, 'locate').and.callThrough();

			$scope.getWebLocation();
			$httpBackend.flush();
			expect(locatorMock.locate).toHaveBeenCalledWith("http://freegeoip.net/json/google.com");
		});

		it('stores the webLocation if the website exists', function(){
			$scope.host = 'google.com';

			$scope.getWebLocation();
			$httpBackend.flush();
			expect($scope.webLocation).toEqual(googleLocation);
			expect($scope.locationError).toBe('');
		});

		it('sets the locationError if the website does not exist', function(){
			$scope.host = 'le.com';

			$scope.getWebLocation();
			$httpBackend.flush();
			expect($scope.webLocation).not.toBeDefined();
			expect($scope.locationError).toBe('404 page not found');
		});

		it('sets the webLocation on the locator if the website exists', function(){
			$scope.host = 'google.com';
			spyOn(locatorMock, 'setWebLocation').and.callThrough();

			$scope.getWebLocation();
			$httpBackend.flush();
			expect(locatorMock.setWebLocation).toHaveBeenCalledWith({ "latitude": 39.76, "longitude": -98.5 });
		});

		it('unsets the webLocation on the locator if the website does not exist', function(){
			$scope.host = 'le.com';
			spyOn(locatorMock, 'setWebLocation').and.callThrough();

			$scope.getWebLocation();
			$httpBackend.flush();
			expect(locatorMock.setWebLocation).toHaveBeenCalledWith(undefined);
		});

		it('adds the webLocation to the history if the website exists', function(){
			$scope.host = 'google.com';
			spyOn(webHistoryMock, 'addTo').and.callThrough();

			$scope.getWebLocation();
			$httpBackend.flush();
			expect(webHistoryMock.addTo).toHaveBeenCalledWith(googleLocation);
		});

		it('does not add the webLocation to the history if the website does not exist', function(){
			$scope.host = 'le.com';
			spyOn(webHistoryMock, 'addTo').and.callThrough();

			$scope.getWebLocation();
			$httpBackend.flush();
			expect(webHistoryMock.addTo).not.toHaveBeenCalled();
		});
	});

	describe('$scope.$watch', function(){
		it('updates the host if it is being recalled from history', function(){
			$scope.recalledHost = 'google.com';

			$scope.$digest();
			expect($scope.host).toBe('google.com');
		});

		it('does not update the host if the recalled url did not change', function(){
			$scope.host = 'google.com';
			$scope.recalledHost = '';

			$scope.$digest();
			expect($scope.host).toBe('google.com');
		});
	});
});
