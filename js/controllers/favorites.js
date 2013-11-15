angular.module('di_fm_favorites.controllers')
.controller('FavoritesController', function($scope, $route, $location, $http) {
    var UPDATE_INTERVAL = '30000',
        DI_FM_STATIONS_URL = 'http://listen.di.fm/streamlist',
        //Favorites come down in the auth request, but we can live update them using this
        DI_FM_FAVORITES_URL = 'http://listen.di.fm/public3/favorites',
        DI_FM_TRACK_HISTORY_URL = 'https://api.audioaddict.com/v1/di/track_history';

    $scope.update = function() {
        //TODO: Update all the things
        var user = localStorage.getItem('di_fm_user');

        if(user) {
            var listenKey = user.listen_key;
        }
    };
});