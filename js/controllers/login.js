angular.module('di_fm_favorites.controllers')
.controller('LoginController', function($scope, $route, $location, $http) {
    var DI_FM_AUTH_URL = 'https://api.audioaddict.com/v1/di/members/authenticate';

    //Alerts stuff
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    //Restore username
    $scope.username = localStorage.getItem('di_fm_last_username');

    //Login method
    $scope.login = function() {
        var username = $scope.username
            ,password = $scope.password;

        //Stash username to remember
        localStorage.setItem('di_fm_last_username', username);

        //Show logging in alert
        $scope.alerts[0] = {
            type: 'warning',
            msg: 'Logging in...'
        };

        //Attempt login
        $http.get(DI_FM_AUTH_URL, {
            params: {
                '_method': 'POST',
                'username': username,
                'password': password
            }
        }).success(function(resp, status) {
            //Stash it in localstorage
            localStorage.setItem('di_fm_user', JSON.stringify(resp));

            //Go to favorites
            $location.path('/favorites');
        }).error(function(resp, status) {
            $scope.alerts[0] = {
                type: 'danger'
                ,msg: 'Login failed - please try again'
            };
        });
    };
});