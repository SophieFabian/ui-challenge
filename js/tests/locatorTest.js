'use strict';

describe('Service: locator', function(){
	beforeEach(module('GeoLocationApp'));

	var $http;
	var $httpBackend;
	var locator;
	var testMarkers = [	{ "latitude": 38.7932, "longitude": -77.5366 },
						{ "latitude": 39.76, "longitude": -98.5 }];
	var excludeUndefinedMock = function(input){
		var output = [];
		for (var i = 0; i < input.length; i++){
			if(input[i] !== undefined){
				output.push(input[i]);
			}
		}
		return output;
	};

	beforeEach(function(){
		module(function($provide){
			$provide.value('excludeUndefinedFilter', excludeUndefinedMock);
		});
	});

	beforeEach(inject(function(_$http_,_$httpBackend_,_locator_){
		$http = _$http_;
		$httpBackend = _$httpBackend_;
		locator = _locator_;

		$httpBackend
			.when('GET', 'http://freegeoip.net/json/google.com')
			.respond(testMarkers[1]);
		$httpBackend
			.when('GET', 'http://freegeoip.net/json/le.com')
			.respond(404, '404 page not found');
	}));

	it('returns an object with locate, and getter setter functions',function(){

		expect(locator.locate).toBeDefined();
		expect(locator.getMarkers).toBeDefined();
		expect(locator.setUserLocation).toBeDefined();
		expect(locator.setWebLocation).toBeDefined();
		expect(locator.getRecalledHost).toBeDefined();
		expect(locator.setRecalledHost).toBeDefined();
	});

	it('sends correct http requests',function(){
		spyOn($http,'get').and.callThrough();
		locator.locate("http://freegeoip.net/json/google.com");

		expect($http.get).toHaveBeenCalledWith("http://freegeoip.net/json/google.com");
	});

	it('handles success callback',function(){
		var promise = locator.locate("http://freegeoip.net/json/google.com");
		var theResult;

		promise.then(function(result){
			theResult = result;
		});
		$httpBackend.flush();

		expect(theResult).toBeDefined();
	});

	it('handles error callback',function(){
		var promise = locator.locate("http://freegeoip.net/json/le.com");
		var theResult, theError;

		promise.then(function(result) {
			theResult = result;
		}, function(error) {
			theError = error;
		});
		$httpBackend.flush();

		expect(theResult).not.toBeDefined();
		expect(theError).toBeDefined();
	});

	it('initially contains no markers and no recalled host',function(){

		expect(locator.getMarkers()).toEqual([]);
		expect(locator.getRecalledHost()).toBe("");
	});

	it('can set and get the userLocation',function(){
		locator.setUserLocation(testMarkers[0]);

		expect(locator.getMarkers().length).toBe(1);
		expect(locator.getMarkers()[0].id).toBe("user");
		expect(locator.getMarkers()[0].latitude).toBe(38.7932);
		expect(locator.getMarkers()[0].longitude).toBe(-77.5366);
	});

	it('can set and get the webLocation',function(){
		locator.setWebLocation(testMarkers[1]);

		expect(locator.getMarkers().length).toBe(1);
		expect(locator.getMarkers()[0].id).toBe("web");
		expect(locator.getMarkers()[0].latitude).toBe(39.76);
		expect(locator.getMarkers()[0].longitude).toBe(-98.5);
	});

	it('can set and get the both locations',function(){
		locator.setUserLocation(testMarkers[0]);
		locator.setWebLocation(testMarkers[1]);

		expect(locator.getMarkers().length).toBe(2);
		expect(locator.getMarkers()[0].id).toBe("user");
		expect(locator.getMarkers()[0].latitude).toBe(38.7932);
		expect(locator.getMarkers()[0].longitude).toBe(-77.5366);
		expect(locator.getMarkers()[1].id).toBe("web");
		expect(locator.getMarkers()[1].latitude).toBe(39.76);
		expect(locator.getMarkers()[1].longitude).toBe(-98.5);
	});

	it('can set and get the recalledHost',function(){
		locator.setRecalledHost("google.com");

		expect(locator.getRecalledHost()).toBe("google.com");
	});
});
