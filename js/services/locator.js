'use strict';

app.factory('locator', ['$http', "$q", function($http, $q){

	var locations = {};
	var markers = [];

	var updateMarkers = function(){
		if(locations.user === undefined && locations.web === undefined){
			markers = [];
		}else if(locations.user !== undefined && locations.web === undefined){
			markers = [locations.user];
		}else if(locations.user === undefined && locations.web !== undefined){
			markers = [locations.web];
		}else{
			markers = [locations.user,locations.web];
		}
	};

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
			return markers;
		},
		setUserLocation: function(location){
			locations.user = location;
			if (locations.user !== undefined){
				locations.user.id = "user";
				locations.user.showWindow = false;
				locations.user.options = {
					icon:"http://maps.google.com/mapfiles/ms/micons/red-pushpin.png",
					labelContent: "User Location",
					labelAnchor: "62 0",
					labelClass: "whiteShadow",
					windowMessage: "Yes, this is where YOU are - at"
				};
			}
			updateMarkers();
		},
		setWebLocation: function(location){
			locations.web = location;
			if (locations.web !== undefined){
				locations.web.id = "web";
				locations.web.showWindow = false;
				locations.web.options = {
					icon:"http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
					labelContent: "Web Location",
					labelAnchor: "61 0",
					labelClass: "whiteShadow",
					windowMessage: "Yes, this is where your WEBSITE is - at"
				};
			}
			updateMarkers();
		}
	}
}]);
