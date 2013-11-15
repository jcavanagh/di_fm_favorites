angular.module('di_fm_favorites', [
    'ngRoute',
    'ui.bootstrap',
    'di_fm_favorites.controllers'
]).config(function($routeProvider) {
    //Routes!
    $routeProvider.when('/', {
        templateUrl: '/views/_favorites.html'
    });

    $routeProvider.when('/login', {
        templateUrl: '/views/_login.html'
    });
}).run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        //Try loading from localstorage
        $rootScope.user = localStorage.getItem('di_fm_user');

        //If we don't have user data, we need to login
        if ( $rootScope.user === null ) {
            // no logged user, we should be going to #login
            if ( next.templateUrl == '/views/_login.html' ) {
                // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
                $location.path( '/login' );
            }
        }
    });
});