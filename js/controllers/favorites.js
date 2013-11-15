angular.module('di_fm_favorites.controllers')
.controller('FavoritesController', function($scope, $route, $location, $http) {
    var UPDATE_INTERVAL = '60000',
        UPDATE_TIMEOUT = '15000',
        DI_FM_STATIONS_URL = 'http://listen.di.fm/streamlist',
        //Favorites come down in the auth request, but we can live update them using this
        DI_FM_FAVORITES_URL = 'http://listen.di.fm/public3/favorites',
        DI_FM_TRACK_HISTORY_URL = 'http://api.audioaddict.com/v1/di/track_history';

    //Alerts stuff
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    //Helpers
    function getListenKey() {
        var user = JSON.parse(localStorage.getItem('di_fm_user'));

        return user ? user.listen_key : null;
    }

    function getThing(thing, url, callback) {
        console.debug('Getting', thing, '...');

        $http.get(url, {
            params: {
                listen_key: getListenKey(),
                timeout: UPDATE_TIMEOUT
            }
        }).success(function(resp, status) {
            console.debug('Done!');

            callback(resp);
        }).error(function(resp, status) {
            $scope.alerts[0] = {
                type: 'danger',
                msg: 'Failed to retrieve ' + thing + '!  Please refresh and try again.'
            };
        });
    }

    function getStations(callback) {
        getThing('stations', DI_FM_STATIONS_URL, callback);
    }

    function getFavorites(callback) {
        getThing('favorites', DI_FM_FAVORITES_URL, callback);
    }

    function getTrackHistory(callback) {
        getThing('track history', DI_FM_TRACK_HISTORY_URL, function(history) {
            //This comes back as not an array, so let's make it one
            var arr = [];
            for(var x in history) {
                arr.push(history[x]);

            }

            callback(arr);
        });
    }

    //Scope methods
    $scope.update = function() {
        getStations(function(stations) {
            getFavorites(function(favorites) {
                favorites = favorites || [];

                getTrackHistory(function(trackHistories) {
                    //Merge all the garbage together
                    $scope.favorites = favorites.map(function(favorite) {
                        var stationName = favorite.match(/.+di_(.+)\?.+/)[1];

                        if(stationName) {
                            //Find the station name in the station list, get the ID
                            var station = stations.filter(function(station, idx, arr) {
                                return station.key && station.key == stationName;
                            })[0];

                            if(station) {
                                var stationId = station.id
                                    ,trackHistory = trackHistories.filter(function(history, idx, arr) {
                                        return history && history.channel_id == stationId;
                                    })[0];

                                if(trackHistory) {
                                    //Build our favorite
                                    return {
                                        station: station.name,
                                        title: trackHistory.title,
                                        artist: trackHistory.artist
                                    };
                                }
                            } else {
                                console.warn('Failed to find station with name:', stationName);
                            }
                        } else {
                            console.warn('Failed to parse station name:', favorite);
                        }
                    });
                });
            });
        });
    };

    //Update!
    $scope.update();
});