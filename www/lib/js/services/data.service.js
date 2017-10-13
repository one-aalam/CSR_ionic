angular.module('starterDataService', []).service('DataService', function ($http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
    var that = this;
    this.apiData = [];

    this.getApiData = function () {
        console.log('getApiData', this.apiData);
        return this.apiData;
    };

    this.geoAPI = function (cb) {
        console.log('in geo');
        $ionicPlatform.ready(function () {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

            var posOptions = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat = position.coords.latitude,
                    long = position.coords.longitude,
                    myLatlng = new google.maps.LatLng(lat, long),
                    mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                console.log('before map');
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                console.log('map', map);
                //$scope.map = map;   
                $ionicLoading.hide();
                console.log('lat1', lat, 'long1', long);
                var lat1 = lat;
                var long1 = long;

                $http.get('https://csrsample.herokuapp.com/calculateDistance/' + encodeURI(lat1) + '/' + encodeURI(long1)).success(function (data) {
                    console.log('api called');
                    that.apiData = data;
                    if (cb) {
                        cb();
                    }
                });
            }, function (err) {
                $ionicLoading.hide();
                console.log(err);
            });
        })
    };

    this.searchAPI = function (lat, long, cb) {
        console.log('in search');
        $http.get('https://csrsample.herokuapp.com/calculateDistance/' + encodeURI(lat) + '/' + encodeURI(long)).success(function (data) {
            console.log('api called');
            that.apiData = data;
            console.log('api data inside searchAPI', that.apiData);
        });
        if (cb) {
            cb();
        }
    };
    return this;
});