app.factory('locator', ['$http', function($http){

	var locations = {};

	return {
		fn: function(host){
				return $http.get(host)
				.success(function(data){
					return data;
				})
				.error(function(err){
					return err;
				});
		},
		getLocations: function(){
			return locations;
		},
		setUserLocation: function(location){
			locations.user = location;
			if (locations.user !== undefined){
				locations.user.id = "user";
				locations.user.showWindow = false;
				locations.user.options = {
					labelContent: 'User Location',
					labelAnchor: "52 0",
					labelClass: ""
				}
			}
		},
		setWebLocation: function(location){
			locations.web = location;
			locations.web.id = "web";
			locations.web.showWindow = false;
			locations.web.options = {
				labelContent: 'Web Location',
				labelAnchor: "51 0",
				labelClass: ""
			}
		}
	}
}]);
