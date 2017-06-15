angular.module('starter', ['ngCookies', 'ionic', 'ngCordova'])


.run(function($rootScope, $cookieStore, $state, $ionicPlatform, $window) {

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            console.log('in cordova');
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            $rootScope.$on('$stateChangeStart', function(event, next, current) {
                var userInfo = $cookieStore.get('userInfo');
                if (!userInfo) {
                    // user not logged in | redirect to login
                    if (next.name !== "welcome") {
                        console.log('in rootScope if');
                        // not going to #welcome, we should redirect now
                        event.preventDefault();
                        $state.go('welcome');
                    }
                } else if (next.name === "welcome") {
                    console.log('in rootScope else');
                    event.preventDefault();
                    $state.go('dashboard');
                }
            })
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
            console.log('in cordova');
        }
    })

})

.service("UserService", function() {

    this.get = function(key) {
        return window.localStorage.getItem(key);
    };
    this.set = function(key, id) {
        window.localStorage.setItem(key, id);
        return true;
    };
    this.remove = function(key) {
        window.localStorage.removeItem(key);
        return true;
    }
    return this;
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('list', {
        url: '/list',
        templateUrl: 'templates/list.html',
        controller: 'ListController'
    })

    .state('detail', {
        url: '/list/:ngoId',
        templateUrl: 'templates/detail.html',
        controller: 'DetailController'
    })

    .state('seek', {
        url: '/seek',
        templateUrl: 'templates/seek.html'
    })

    .state('raiseRequest', {
        url: '/raiseRequest',
        templateUrl: 'templates/raiseRequest.html',
        controller: 'putserviceCtrl',
    })

    .state('updateRequest', {
        url: '/updateRequest',
        templateUrl: 'templates/updateRequest.html',
        controller: 'GetController'
    })

    .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })

    .state('welcome', {
        url: "/welcome",
        templateUrl: "templates/welcome.html",
        controller: 'WelcomeCtrl',
        cache: false
    })

    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "templates/dashboard.html",
        controller: "dashboardCtrl"
    })

    $urlRouterProvider.otherwise('/home');
})

.service("UserService", function() {

    this.get = function(key) {
        return window.localStorage.getItem(key);
    };
    this.set = function(key, id) {
        window.localStorage.setItem(key, id);
        return true;
    };
    this.remove = function(key) {
        window.localStorage.removeItem(key);
        return true;
    }
    return this;
})

.controller('HomeController', ['$scope', '$state', 'UserService',
    function($scope, $state, UserService) {
        $scope.setUserType = function(type) {
            UserService.set("userType", type);
            console.log(UserService.get("userType"));
            $state.go('welcome', {
                "type": type
            });
        };
    }
])


/*.controller('ListController', ['$scope', '$http', '$state', '$ionicHistory,'UserService',
    function($scope, $http, $state,UserService) {
.goBack()*/
.controller('ListController', ['$scope', '$http', '$state', 'DataService',
    function($scope, $http, $state, DataService) {

        console.log('Inside List Controller');
        $scope.ngo = DataService.getApiData();
        console.log('ngo', $scope.ngo);

        $scope.GetLocation = function(address) {
            console.log('Inside GetLocation');
            var geocoder = new google.maps.Geocoder();
            //var address = document.getElementById("txtAddress").value;
            var address = address;
            console.log('address', address);
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    console.log('lat', latitude, 'long', longitude);
                    /*DataService.search(latitude,longitude).then(function () {
                      console.log('get API data called after search');
                      $scope.ngo = DataService.getApiData();
              });*/

                    DataService.search(latitude, longitude, function() {
                        console.log('get API data called after search');
                        $scope.ngo = DataService.getApiData();
                    });

                } else {
                    console.log("Request failed.");
                }
            });
        };


    }
])

.controller('DetailController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {

        $scope.ngoId = $state.params.ngoId;
        $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI($scope.ngoId)).success(function(data) {
            console.log('api call successful');
            $scope.charity = data;
            console.log($scope.charity);

        });
    }
])


.controller('putserviceCtrl', ['$scope', '$http', '$state', 'UserService', function($scope, $http, $state, UserService) {

    if (UserService.get("userStatus")) {
        $scope.cause = null;
        console.log('putserviceCtrl called');
        $scope.requirement = [];
        $scope.category = null;
        $scope.product = null;
        $scope.quantity = null;

        $scope.putdata = function(cause, category, product, quantity) {
            var data = {
                cause: cause,
                requirement: [{
                    reqId: new Date().getTime().toString(),
                    category: category,
                    product: product,
                    quantity: quantity,
                    status: true
                }]
            };

            var ngoId = UserService.get("userId");
            console.log(UserService.get("userId"));
            console.log("NGOId", ngoId);

            $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("userId")) + '/event', data).then(function(response) {
                if (response.data)
                    $scope.msg = "Put Data Method Executed Successfully!";
            });

            $state.go('seek');
        };
    } else {
        $state.go('home');
    }

}])


.controller('GetController', ['$scope', '$http', '$state', 'UserService', function($scope, $http, $state, UserService) {

    $scope.Update = function(reqId) {
        console.log(reqId);
        console.log("userid", UserService.get("userId"));
        $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("userId")) + '/delete/' + encodeURI(reqId)).then(function(response) {
            if (response.data)
                $scope.msg = "Put Data Method Executed Successfully!";
        });
    };
    console.log(UserService.get("userSatus"));
    if (UserService.get("userStatus")) {
        $scope.pageData = {
            charity: "",
            event: "",
            requirement: ""
        };
        $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("userId"))).success(function(data) {
            console.log(data);

            $scope.charity = data;
            $scope.event = data.charityEvent;
            $scope.requirement = $scope.event.requirement;

            console.log('event', $scope.event);
        });
    } else {
        $state.go('home');
    }
}])


.controller('WelcomeCtrl', function($scope, $state, $cookieStore, $http, UserService, DataService) {
    $scope.userType = UserService.get("userType");

    $scope.guestSignin = function() {

        if (UserService.get("userType") === 'C') {
            DataService.geoAPI(function() {
                console.log('After geo called inside guestSignIn of welcomeCtrl');
                $state.go('list');
            });
        } else {
            if (UserService.get("userType") === 'N') {
                $window.alert('Please log in to continue.');
                $state.go('welcome');
            } else {
                $state.go('welcome');
            }
        };
    };

    $scope.fbLogin = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                getUserInfo();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: 'email,user_photos,user_videos'
        });

        function getUserInfo() {
            FB.api('/me', function(response) {
                console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                FB.api('/me/picture?type=normal', function(picResponse) {
                    console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                    response.imageUrl = picResponse.data.url;
                    var user = {};
                    user.userName = response.name;
                    user.userId = response.id;
                    UserService.set("userId", response.id);
                    UserService.set("userStatus", true);
                    console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                    $http.get('https://csrsample.herokuapp.com/users').success(function(data) {
                        if (!data) {
                            $http.post('https://csrsample.herokuapp.com/users', user).then(function(response) {
                                if (response.data)
                                    $scope.msg = "Api Call successfull";
                                console.log('Success---------');
                            });
                            $cookieStore.put('userInfo', user);
                            $state.go('dashboard');
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                console.log('inside for');
                                var obj = data[i];
                                console.log(obj);
                                if (obj.userId == user.userId) {
                                    console.log('inside if');
                                    $cookieStore.put('userInfo', user);
                                    $scope.flag = 1;
                                    break;
                                }
                            }

                            if ($scope.flag == 1) {
                                if (UserService.get("userType") == 'C') {
                                    DataService.geoAPI(function() {
                                        console.log('geo called when existing user try to login');
                                        $state.go('list');
                                    });



                                } else if (UserService.get("userType") == 'N') {
                                    $state.go('seek');
                                }
                            } else {
                                $http.post('https://csrsample.herokuapp.com/users', user).then(function(response) {
                                    if (response.data)
                                        $scope.msg = "Api Call successfull";
                                    console.log('Success');
                                });
                                $cookieStore.put('userInfo', user);
                                $state.go('dashboard');
                            }
                        }

                    });

                });
            });
        }
    };
    // END FB Login

    // Google Plus Login
    $scope.gplusLogin = function() {
        var myParams = {
            // Replace client id with yours
            'clientid': '374010870485-pq83isui0ccj4t1ts0elb8eo200ond3k.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': loginCallback,
            'approvalprompt': 'force',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        };
        gapi.auth.signIn(myParams);

        function loginCallback(result) {
            if (result['status']['signed_in']) {
                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });
                request.execute(function(resp) {
                    console.log('Google+ Login RESPONSE: ' + angular.toJson(resp));
                    var userEmail;
                    if (resp['emails']) {
                        for (var i = 0; i < resp['emails'].length; i++) {
                            if (resp['emails'][i]['type'] == 'account') {
                                userEmail = resp['emails'][i]['value'];
                            }
                        }
                    }


                    // store data to DB
                    var user = {};
                    user.userName = resp.displayName;
                    /*user.email = userEmail;*/
                    /*user.email = resp.emails;*/
                    user.userId = resp.id;
                    UserService.set("userId", resp.id);
                    //$rootScope.userId = resp.id;
                    UserService.set("userStatus", true);
                    console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                    // $rootScope.userStatus = 'A';



                    $http.get('https://csrsample.herokuapp.com/users').success(function(data) {
                        if (!data) {
                            $http.post('https://csrsample.herokuapp.com/users', user).then(function(response) {
                                if (response.data)
                                    $scope.msg = "Api Call successfull";
                                console.log('Success---------');
                            });
                            $cookieStore.put('userInfo', user);
                            $state.go('dashboard');
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                console.log('inside for');
                                var obj = data[i];
                                console.log(obj);
                                if (obj.userId == user.userId) {
                                    console.log('inside if');
                                    /*$state.go('list');*/
                                    $cookieStore.put('userInfo', user);
                                    $scope.flag = 1;
                                    break;
                                }
                            }

                            if ($scope.flag == 1) {
                                if (UserService.get("userType") == 'C') {
                                    DataService.geoAPI(function() {
                                        console.log('geo called inside welcome when existing user try to login');
                                        $state.go('list');
                                    });


                                } else if (UserService.get("userType") == 'N') {
                                    $state.go('seek');
                                }
                            } else {
                                $http.post('https://csrsample.herokuapp.com/users', user).then(function(response) {
                                    if (response.data)
                                        $scope.msg = "Api Call successfull";
                                    console.log('Success');
                                });
                                $cookieStore.put('userInfo', user);
                                $state.go('dashboard');
                            }
                        }

                    });


                    /*$http.post('http://10.202.249.51:8080/users', user).then(function (response) {
                      if (response.data)
                       $scope.msg = "Api Call successfull";
                        console.log('Success');
       });
                       
                    /*user.profilePic = resp.image.url;*/

                });
            }
        }
    };
    // END Google Plus Login




})

.controller('dashboardCtrl', function($scope, $window, $state, $cookieStore, UserService, DataService) {

    $scope.user = $cookieStore.get('userInfo');

    $scope.logout = function() {
        console.log('In logout');
        $cookieStore.remove("userInfo");
        console.log("Hello");
        console.log('userInfo');
        UserService.set("userStatus", false);
        $state.go('welcome');
        UserService.remove("userStatus");
        UserService.remove("userId");
        UserService.remove("userType");


        $window.location.reload();

    };

    $scope.submit = function() {
        console.log('In submit');
        if (UserService.get("userType") == 'C') {
            DataService.geoAPI(function() {
                console.log('geo called inside welcome when new user try to login');
                $state.go('list');
            });
        } else {
            if (UserService.get("userType") == 'N') {
                $state.go('seek');
            } else {
                $state.go('welcome');
            }
        }
        $window.location.reload();

    };
})

.service('DataService', function($http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    var that = this;

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    this.apiData = [];

    this.getApiData = function() {
        console.log('getApiData', this.apiData);
        return this.apiData;
    };

    this.geo = function(cb) {
        console.log('in geo');
        $ionicPlatform.ready(function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

            var posOptions = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
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

                $http.get('https://csrsample.herokuapp.com/charity').success(function(data) {
                    console.log('api called');
                    var ngoData = data;

                    angular.forEach(ngoData, function(obj, index) {
                        console.log(lat, long, obj.latitude, obj.longitude);

                        var distance = getDistanceFromLatLonInKm(lat, long, obj.latitude, obj.longitude);

                        obj["distance"] = distance;
                    });

                    console.log('ngoData from GEO', ngoData);

                    that.apiData = ngoData;

                    if (cb) {
                        cb();
                    }

                });
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
            });
        })
    };

    this.geoAPI = function(cb) {
        console.log('in geo');
        $ionicPlatform.ready(function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

            var posOptions = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
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

                $http.get('https://csrsample.herokuapp.com/calculateDistance/' + encodeURI(lat1) + '/' + encodeURI(long1)).success(function(data) {
                    console.log('api called');
                    that.apiData = data;

                    if (cb) {
                        cb();
                    }

                });
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
            });
        })
    };

    this.search = function(lat, long, cb) {
        console.log('in search');
        var ngoData = that.apiData;
        console.log('ngoData initialised', ngoData);

        angular.forEach(ngoData, function(obj, index) {
            console.log(lat, long, obj.latitude, obj.longitude);

            var distance = getDistanceFromLatLonInKm(lat, long, obj.latitude, obj.longitude);

            obj["distance"] = distance;
        });

        console.log('ngoData from search', ngoData);

        that.apiData = ngoData;
        if (cb) {
            cb();
        }
    };

    this.searchAPI = function(lat, long, cb) {
        console.log('in search');
        $http.get('https://csrsample.herokuapp.com/calculateDistance/' + encodeURI(lat) + '/' + encodeURI(long)).success(function(data) {
            console.log('api called');
            that.apiData = ngoData;
            console.log('api data inside searchAPI', that.apiData);
        });
        
        if (cb) {
            cb();
        }

    };

    return this;
});