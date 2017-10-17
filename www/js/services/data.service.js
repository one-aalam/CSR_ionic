angular.module('myAppDaoServiceModule', ['myAppConstants']).service('DataService',
    ['$http', '$cordovaGeolocation', '$ionicLoading', '$ionicPlatform', 'BaseService', 'CHECKPOINT_ENDPOINT',
        function ($http, $cordovaGeolocation, $ionicLoading, $ionicPlatform, BaseService, CHECKPOINT_ENDPOINT) {
            var that = this;
            this.apiData = [];

            this.getApiData = function () {
                return this.apiData;
            };

            this.geoAPI = function (cb) {
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
                        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                        $ionicLoading.hide();
                        var lat1 = lat;
                        var long1 = long;
                        that.apiData = BaseService.getData(CHECKPOINT_ENDPOINT, encodeURI(lat1) + '/' + encodeURI(long1));
                        if (that.apiData != null) {
                            if (cb) {
                                cb();
                            }
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                    });
                })
            };

            this.searchAPI = function (lat, long, cb) {
                that.apiData = BaseService.getData(CHECKPOINT_ENDPOINT, encodeURI(lat) + '/' + encodeURI(long));
                if (that.apiData != null) {
                    if (cb) {
                        cb();
                    }
                }
            };
            return this;
        }]);