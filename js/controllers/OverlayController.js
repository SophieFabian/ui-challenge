'use strict';

app.controller('OverlayController', ['$scope', 'showModal', function($scope, showModal){

	$scope.show = showModal.value;

	$scope.hide = function(){
		showModal.value = false;
	};

	$scope.$watch(function(){
			return showModal.value;
		}, function(newValue){
			$scope.show = showModal.value;
		}, true
	);
}]);
