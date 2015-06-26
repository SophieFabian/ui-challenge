'use strict';

describe('Directive: locationInfo', function(){
	beforeEach(module('GeoLocationApp'));

	var $compile, $rootScope;

	beforeEach(inject(function($templateCache, _$compile_, _$rootScope_){
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$rootScope.userLocation = {
				data: { query: "0.0.0.0", country: "USA" },
				label: { query: "IP", country: "Country" },
				order: [ "query","country" ]
		};

		var directiveTemplate = null;
		var req = new XMLHttpRequest();
		req.onload = function(){
			directiveTemplate = this.responseText;
		};
		req.open("get", "js/directives/locationInfo.html", false);
		req.send();

		$templateCache.put("js/directives/locationInfo.html", directiveTemplate);
	}));

	it('inserts the appropriate content with no data passed in', function() {
		var element = $compile("<location-info></location-info>")($rootScope);

		$rootScope.$digest();
		expect(element.html()).toContain("Estimated Location");
		expect(element.html()).not.toContain("<tr");
	});

	it('inserts the appropriate content with some data passed in', function() {
		var element = $compile("<location-info info='userLocation'></location-info>")($rootScope);

		$rootScope.$digest();
		expect(element.html()).toContain("IP");
		expect(element.html()).toContain("0.0.0.0");
		expect(element.html()).toContain("Country");
		expect(element.html()).toContain("USA");
	});
});
