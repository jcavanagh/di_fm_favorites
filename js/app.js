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
    //http://stackoverflow.com/questions/11541695/angular-js-redirecting-to-a-certain-route-based-on-condition
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if ( $rootScope.user == null ) {
            // no logged user, we should be going to #login
            if ( next.templateUrl == '/views/_login.html' ) {
                // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
                $location.path( '/login' );
            }
        }
    });
})