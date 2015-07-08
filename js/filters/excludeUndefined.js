'use strict';

app.filter('excludeUndefined', function(){
	return function(input){
		if (input === undefined || input === null){ return input; }

		var output = [];
		for (var i = 0; i < input.length; i++){
			if(input[i] !== undefined){
				output.push(input[i]);
			}
		}
		return output;
	};
});