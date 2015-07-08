'use strict';

describe('Controller: OverlayController', function(){
	beforeEach(module('GeoLocationApp'));

	var $scope;
	var showModalMock = { value: false };

	beforeEach(inject(function($controller,$rootScope){
		$scope = $rootScope;
		$controller('OverlayController', { $scope: $scope, showModal: showModalMock });
	}));

	describe('$scope initial state', function(){
		it('variables are in their initial state', function(){

			expect($scope.show).toBeFalsy();
			expect($scope.hide).toBeDefined();
		});
	});

	describe('$scope.hide', function(){
		it('set showModal to false', function(){
			showModalMock.value = true;

			expect(showModalMock.value).toBeTruthy();
			$scope.hide();
			expect(showModalMock.value).toBeFalsy();
			$scope.hide();
			expect(showModalMock.value).toBeFalsy();
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
