angular.module('di_fm_favorites.controllers')
.controller('FavoritesController', function($scope, $route, $location) {
    //Connect to chrome messaging
    var msgPort = chrome.runtime.connect();

    //Alerts stuff
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.openTab = function(url) {
        chrome.tabs.create({
            url: url
        });
    };

    $scope.refresh = function() {
        $scope.favorites = null;

        if(msgPort) {
            msgPort.postMessage({ msg: 'getFavorites' });
        } else {
            console.error('No port - not updating favorites');
        }
    };

    $scope.logout = function() {
        //Nuke localstorage user
        localStorage.removeItem('di_fm_user');

        //Route to login
        $location.path('/login');
    };

    //Listener for favorites errors
    msgPort.onMessage.addListener(function(message) {
        switch(message.msg) {
            case 'favoritesUpdated':
                $scope.favorites = message.data;
                break;
            case 'favoritesAlert':
                $scope.alerts[0] = message.data;
                break;
        }

        //Update teh angularz
        setTimeout($scope.$apply, 0);
    });

    //Update!
    $scope.refresh();
});