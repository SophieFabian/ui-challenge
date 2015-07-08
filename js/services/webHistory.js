'use strict';

app.factory('webHistory', [function(){

	var history = [];

	return {
		get: function(){
			return history;
		},
		addTo: function(location){
			history.push(location);
		}
	};
}]);
