angular.module('myAppDaoServiceModule', ['myAppConstants']).service('DataService',
    ['$http', '$cordovaGeolocation', '$ionicLoading', '$ionicPlatform', 'BaseService', 'CHECKPOINT_ENDPOINT',
        function ($http, $cordovaGeolocation, $ionicLoading, $ionicPlatform, BaseService, CHECKPOINT_ENDPOINT) {
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
                        $ionicLoading.hide();
                        console.log('lat1', lat, 'long1', long);
                        var lat1 = lat;
                        var long1 = long;
                        that.apiData = BaseService.getData(CHECKPOINT_ENDPOINT, encodeURI(lat1) + '/' + encodeURI(long1));
                        console.log("test shilpa"+this.apiData);
                        if (that.apiData != null) {
                            console.log('api called');
                            if (cb) {
                                cb();
                            }
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        console.log(err);
                    });
                })
            };

            this.searchAPI = function (lat, long, cb) {
                console.log('in search');
                that.apiData = BaseService.getData(CHECKPOINT_ENDPOINT, encodeURI(lat) + '/' + encodeURI(long));
                if (that.apiData != null) {
                    console.log('api called');
                    if (cb) {
                        cb();
                    }
                    console.log('api data inside searchAPI', that.apiData);
                }
            };
            return this;
        }]);