'use strict';

describe('Controller: WebHistoryController', function(){
	beforeEach(module('GeoLocationApp'));

	var $scope;
	var locatorMock;
	var webHistoryMock;
	var showModalMock = { value: false };
	var testLocations = [	{ "latitude": 38.7932, "longitude": -77.5366 },
							{ "latitude": 39.76, "longitude": -98.5, "host": "google.com" }];

	beforeEach(inject(function($controller,$rootScope){
		$scope = $rootScope;
		locatorMock = {
			setWebLocation: function(location){ return; },
			setRecalledHost: function(oldHost){ return; }
		};
		webHistoryMock = {
				get: function(){ return testLocations; }
		};
		spyOn(webHistoryMock,"get").and.callThrough();
		$controller('WebHistoryController', { $scope: $scope, locator: locatorMock, webHistory: webHistoryMock, showModal: showModalMock });
	}));

	describe('$scope initial state', function(){
		it('calls the webHistory to set up the initial state', function(){

			expect(webHistoryMock.get).toHaveBeenCalled();
		});

		it('variables are in their initial state', function(){

			expect($scope.show).toBeFalsy();
			expect($scope.history).toEqual(testLocations);
			expect($scope.recall).toBeDefined();
		});
	});

	describe('$scope.toggle', function(){
		it('toggles showModal from false to true and back', function(){

			expect(showModalMock.value).toBeFalsy();
			$scope.toggle();
			expect(showModalMock.value).toBeTruthy();
			$scope.toggle();
			expect(showModalMock.value).toBeFalsy();
		});
	});

	describe('$scope.recall', function(){
		it('calls the toggle function', function(){
			spyOn($scope,"toggle");

			$scope.recall(testLocations[0]);
			expect($scope.toggle).toHaveBeenCalled();
		});

		it('calls the setWeblocation function on the locator', function(){
			spyOn(locatorMock,"setWebLocation");

			$scope.recall(testLocations[0]);
			expect(locatorMock.setWebLocation).toHaveBeenCalled();
		});

		it('calls the setWeblocation with the passed in location', function(){
			spyOn(locatorMock,"setWebLocation");

			$scope.recall(testLocations[0]);
			expect(locatorMock.setWebLocation).toHaveBeenCalledWith(testLocations[0]);
		});

		it('calls the setRecalledHost with the clicked url', function(){
			spyOn(locatorMock,"setRecalledHost");

			$scope.recall(testLocations[1]);
			expect(locatorMock.setRecalledHost).toHaveBeenCalledWith(testLocations[1].host);
		});
	});

	describe('$scope.$watch', function(){
		it('updates the show variable if showModal is changed', function(){
			$scope.show = false;
			showModalMock.value = true;

			$scope.$digest();
			expect($scope.show).toBeTruthy();
		});

		it('does not update the show variable if showModal has not changed', function(){
			$scope.show = true;

			$scope.$digest();
			expect($scope.show).toBeTruthy();
		});
	});
});
