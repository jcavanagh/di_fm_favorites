angular.module('di_fm_favorites_bg.services')
.service('FavoritesService', function($http, $interval) {
    //DI.FM things
    var UPDATE_INTERVAL = 60000,
        UPDATE_TIMEOUT = 10000,
        DI_FM_STATIONS_URL = 'http://listen.di.fm/streamlist',
        //Favorites come down in the auth request, but we can live update them using this
        DI_FM_FAVORITES_URL = 'http://listen.di.fm/public3/favorites',
        DI_FM_TRACK_HISTORY_URL = 'http://api.audioaddict.com/v1/di/track_history';

    //Service things
    var cachedFavorites = null,
        msgPort = null;

    //Helpers
    function getListenKey() {
        var user = JSON.parse(localStorage.getItem('di_fm_user'));

        return user ? user.listen_key : null;
    }

    function fetchThing(thing, url, callback) {
        console.debug('Getting', thing, '...');

        $http.get(url, {
            params: {
                listen_key: getListenKey()
            },
            timeout: UPDATE_TIMEOUT
        }).success(function(resp) {
            console.debug('Done!');

            callback(resp);
        }).error(function() {
            var msg = 'Failed to retrieve ' + thing + '!  Please refresh and try again.';

            console.warn(msg);

            if(msgPort) {
                msgPort.postMessage({
                    msg: 'favoritesAlert',
                    data: {
                        type: 'danger',
                        msg: msg
                    }
                });
            }
        });
    }

    function fetchStations(callback) {
        fetchThing('stations', DI_FM_STATIONS_URL, callback);
    }

    function fetchFavorites(callback) {
        fetchThing('favorites', DI_FM_FAVORITES_URL, callback);
    }

    function fetchTrackHistory(callback) {
        fetchThing('track history', DI_FM_TRACK_HISTORY_URL, function(history) {
            //This comes back as not an array, so let's make it one
            var arr = [];
            for(var x in history) {
                arr.push(history[x]);

            }

            callback(arr);
        });
    }

    function fireFavoritesUpdated() {
        if(msgPort) {
            msgPort.postMessage({
                msg: 'favoritesUpdated',
                data: cachedFavorites
            });
        } else {
            console.log('No active port - not sending updates');
        }
    }

    function updateFavorites() {
        fetchStations(function(stations) {
            fetchFavorites(function(favorites) {
                favorites = favorites || [];

                fetchTrackHistory(function(trackHistories) {
                    //Merge all the garbage together
                    cachedFavorites = favorites.map(function(favorite) {
                        var stationName = favorite.match(/.+di_(.+)\?.+/)[1];

                        if(stationName) {
                            //Find the station name in the station list, get the ID
                            var station = stations.filter(function(station) {
                                return station.key && station.key == stationName;
                            })[0];

                            if(station) {
                                var stationId = station.id
                                    ,trackHistory = trackHistories.filter(function(history) {
                                        return history && history.channel_id == stationId;
                                    })[0];

                                if(trackHistory) {
                                    //Build our favorite
                                    return {
                                        station: station.name,
                                        title: trackHistory.title,
                                        artist: trackHistory.artist,
                                        url: 'http://www.di.fm/' + station.key
                                    };
                                }
                            } else {
                                console.warn('Failed to find station with name:', stationName);
                            }
                        } else {
                            console.warn('Failed to parse station name:', favorite);
                        }
                    });

                    //Fire that to the FG page
                    fireFavoritesUpdated();
                });
            });
        });
    }

    function getFavorites() {
        if(cachedFavorites) {
            //If we have cached favorites, use that
            fireFavoritesUpdated();
        } else {
            //Otherwise, fetch favorites
            //This will fire a favoritesUpdated event
            updateFavorites();
        }
    }

    //Update!
    updateFavorites();

    $interval(updateFavorites, UPDATE_INTERVAL, 0, true);

    //Listener for favorites things
    chrome.runtime.onConnect.addListener(function(port) {
        msgPort = port;
        
        port.onMessage.addListener(function(message) {
            switch(message.msg) {
                case 'getFavorites':
                    //This will fire favorites back, either cached or after first update
                    getFavorites();
                    break;
            }
        });
    });

    //Service methods
    return {
        getFavorites: getFavorites
    };
});