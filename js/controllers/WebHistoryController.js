'use strict';

app.controller('WebHistoryController', ['$scope', 'locator', 'webHistory', 'showModal', function($scope, locator, webHistory, showModal){

	$scope.show = showModal.value;
	$scope.history = webHistory.get();

	$scope.toggle = function(){
		showModal.value = !showModal.value;
	}

	$scope.recall = function(location){
		$scope.toggle();
		locator.setWebLocation({
			latitude:location.latitude,
			longitude:location.longitude
		});
		locator.setRecalledHost(location.host);
	};

	$scope.$watch(function(){
			return showModal.value;
		}, function(newValue){
			$scope.show = showModal.value;
		}, true
	);
}]);
