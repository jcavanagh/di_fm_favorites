angular.module('di_fm_favorites', [
    'ngRoute',
    'ui.bootstrap',
    'di_fm_favorites.controllers'
]).config(function($routeProvider) {
    //Routes!
    $routeProvider.when('/', {
        templateUrl: '/views/_blank.html'
    });

    $routeProvider.when('/login', {
        templateUrl: '/views/_login.html'
    });

    $routeProvider.when('/favorites', {
        templateUrl: '/views/_favorites.html'
    });
});