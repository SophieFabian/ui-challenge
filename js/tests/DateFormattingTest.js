'use strict';

describe('Date prototype add on: DateFormatting', function(){

	it('has a format method',function(){

		expect(Date.prototype.format).toBeDefined();
	});

	it('return the date and time in mm/dd/yyyy hh:mm format',function(){
		var d = new Date("2000.12.30 4:00");

		expect(d.format()).toBe("12/30/2000 04:00");
	});
});
