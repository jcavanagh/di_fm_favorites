angular.module('di_fm_favorites.controllers')
.controller('BlankController', function($scope, $route, $location, $http) {
    //Get logged in user data
    var user = localStorage.getItem('di_fm_user');

    if(user) {
        //If we're logged in, go to favorites
        $location.path('/favorites');
    } else {
        //Otherwise, go to login
        $location.path('/login');
    }
});