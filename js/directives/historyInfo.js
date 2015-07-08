'use strict';

app.directive('historyInfo', function(){
	return {
		restrict: 'E',
		scope: {
			info: '=',
			recall: '='
		},
		templateUrl: 'js/directives/historyInfo.html'
	};
});
