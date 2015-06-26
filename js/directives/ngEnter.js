'use strict';

app.directive('ngEnter', function(){
	return function(scope, element, attrs){
		element.bind("keydown keypress", function(event){
			if(event.keyCode === 13){
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});
