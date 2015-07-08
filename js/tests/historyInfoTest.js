'use strict';

describe('Directive: historyInfo', function(){
	beforeEach(module('GeoLocationApp'));

	var $compile, $rootScope;

	beforeEach(inject(function($templateCache, _$compile_, _$rootScope_){
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$rootScope.history = [{
			"ip":"2607:f8b0:4006:80e::200e",
			"country_code":"US",
			"country_name":"United States",
			"latitude":39.76,
			"longitude":-98.5,
			"host":"google.com"
		}];

		var directiveTemplate = null;
		var req = new XMLHttpRequest();
		req.onload = function(){
			directiveTemplate = this.responseText;
		};
		req.open("get", "js/directives/historyInfo.html", false);
		req.send();

		$templateCache.put("js/directives/historyInfo.html", directiveTemplate);
	}));

	it('inserts the appropriate content with no data', function(){
		var element = $compile("<history-info info='[]'></history-info>")($rootScope);

		$rootScope.$digest();
		expect(element.html()).toContain("There is no history to show.");
		expect(element.html()).not.toContain("<li");
	});

	it('inserts the appropriate content with some data', function(){
		var element = $compile("<history-info info='history'></history-info>")($rootScope);

		$rootScope.$digest();
		expect(element.html()).toContain("google.com");
	});
});
