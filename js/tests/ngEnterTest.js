'use strict';

describe('Directive: ngEnter', function () {
	beforeEach(module('GeoLocationApp'));

	var element, $rootScope;

	beforeEach(inject(function(_$rootScope_){
		$rootScope = _$rootScope_;
		$rootScope.mockFunction = function(){};
		compileDirective();
	}));

	function compileDirective(){
		element = angular.element('<input type="text" ng-enter="mockFunction()" />');
		inject(function($compile){
			element = $compile(element)($rootScope);
		});
		$rootScope.$apply();
	}

	it('calls the function on pressing enter', function(){
		spyOn($rootScope,'mockFunction');
		var event = new Event('keypress');
		event.keyCode = 13;

		element.triggerHandler(event);
		expect($rootScope.mockFunction).toHaveBeenCalled();
	});

	it('does not call the function on pressing something else', function(){
		spyOn($rootScope,'mockFunction');
		var event = new Event('keypress');
		event.keyCode = Math.floor((Math.random() * 100) + 1);
		while(event.keyCode === 13){
			event.keyCode = Math.floor((Math.random() * 100) + 1);
		}

		element.triggerHandler(event);
		expect($rootScope.mockFunction).not.toHaveBeenCalled();
	});
});
