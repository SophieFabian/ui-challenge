'use strict';

describe('Service: webHistory', function(){
	beforeEach(module('GeoLocationApp'));

	var webHistory;
	var testLocations = [	{ "latitude": 38.7932, "longitude": -77.5366 },
							{ "latitude": 39.76, "longitude": -98.5 }];

	beforeEach(inject(function(_webHistory_){
		webHistory = _webHistory_;
	}));

	it('returns an object with get and addTo',function(){

		expect(webHistory.get).toBeDefined();
		expect(webHistory.addTo).toBeDefined();
	});

	it('get function return an empty array initially',function(){

		expect(webHistory.get()).toEqual([]);
	});

	it('can store and return a location',function(){
		webHistory.addTo(testLocations[0]);

		expect(webHistory.get()).toEqual([testLocations[0]]);
	});

	it('can store and return a multiple locations',function(){
		webHistory.addTo(testLocations[0]);
		webHistory.addTo(testLocations[1]);

		expect(webHistory.get()).toEqual(testLocations);
	});
});
