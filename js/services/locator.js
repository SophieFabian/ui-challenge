'use strict';

app.factory('locator', ['$http', '$q', '$filter', function($http, $q, $filter){

	var recalledHost = "";
	var innerMarkers = [undefined,undefined];
	var outerMarkers = [];

	return {
		locate: function(host){
					var deferred = $q.defer();
					$http.get(host)
						.success(function(result){
							deferred.resolve(result);
						})
						.error(function(err){
							deferred.reject(err);
						});
					return deferred.promise;
		},
		getMarkers: function(){
			return outerMarkers;
		},
		setUserLocation: function(location){
			if (location !== undefined){
				location.id = "user";
				location.showWindow = false;
				location.options = {
					icon:"http://maps.google.com/mapfiles/ms/micons/red-pushpin.png",
					labelContent: "User Location",
					labelAnchor: "62 0",
					labelClass: "whiteShadow",
					windowMessage: "Yes, this is where YOU are - at"
				};
			}
			innerMarkers[0] = location;
			outerMarkers = $filter("excludeUndefined")(innerMarkers);
		},
		setWebLocation: function(location){
			if (location !== undefined){
				location.id = "web";
				location.showWindow = false;
				location.options = {
					icon:"http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
					labelContent: "Web Location",
					labelAnchor: "61 0",
					labelClass: "whiteShadow",
					windowMessage: "Yes, this is where your WEBSITE is - at"
				};
			}
			innerMarkers[1] = location;
			outerMarkers = $filter("excludeUndefined")(innerMarkers);
		},
		getRecalledHost: function(){
			return recalledHost;
		},
		setRecalledHost: function(oldHost){
			recalledHost = oldHost;
		}
	};
}]);
