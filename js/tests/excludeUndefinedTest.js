'use strict';

describe('Filter: excludeUndefined', function () {
	beforeEach(module('GeoLocationApp'));

	var excludeUndefined;

	beforeEach(inject(function($filter){
		excludeUndefined = $filter('excludeUndefined');
	}));

	it('has an excludeUndefined filter', function(){
		expect(excludeUndefined).toBeDefined();
	});

	it('returns input if it is null or undefined', function(){
		expect(excludeUndefined(undefined)).toBeUndefined();
		expect(excludeUndefined(null)).toBeNull();
	});

	it('returns an empty array if the input is empty or only contains undefined', function(){
		expect(excludeUndefined([])).toEqual([]);
		expect(excludeUndefined([undefined])).toEqual([]);
		expect(excludeUndefined([undefined,undefined])).toEqual([]);
	});

	it('returns an equal array if there are no undefined elements', function(){
		expect(excludeUndefined([1])).toEqual([1]);
		expect(excludeUndefined([2,3])).toEqual([2,3]);
		expect(excludeUndefined([4,null,5])).toEqual([4,null,5]);
	});

	it('returns only the defined elements from a mixed array', function(){
		expect(excludeUndefined([undefined,1])).toEqual([1]);
		expect(excludeUndefined([2,undefined,3])).toEqual([2,3]);
		expect(excludeUndefined([4,5,undefined])).toEqual([4,5]);
	});
});