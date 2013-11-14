angular.module('di_fm_favorites.controllers')
.controller('LoginController', function($scope, $route, $location, $http) {
    var DI_FM_AUTH_URL = 'https://api.audioaddict.com/v1/di/members/authenticate';

    $scope.login = function() {
        var username = $scope.model.username
            ,password = $scope.model.password;

        //Alerts stuff
        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        }

        //Attempt login
        $http.get(DI_FM_AUTH_URL, {
            params: {
                '_method': 'POST',
                'username': username,
                'password': password
            }
        }).success(function(resp, status) {
            console.log('success!')
            console.log(resp, status);
        }).error(function(resp, status) {
            console.log('failed!')
            console.log(resp, status);

            $scope.alerts[0] = {
                type: 'danger'
                ,msg: 'Login failed - please try again'
            };
        });
    }
});