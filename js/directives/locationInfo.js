app.directive('locationInfo', function() { 
	return { 
		restrict: 'E', 
		scope: { 
			info: '=' 
		}, 
		templateUrl: 'js/directives/locationInfo.html' 
	}; 
});