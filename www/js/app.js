angular.module('starter', ['ngCookies', 'ionic', 'ngCordova', 'ngCordovaOauth'])


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
        /*if (window.cordova && window.cordova.InAppBrowser) {
            window.open = cordova.InAppBrowser.open;
        }*/
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

    .state('signIn', {
        url: "/signIn",
        templateUrl: "templates/SignIn.html",
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

/*.controller('HomeController', ['$scope', '$state', 'UserService',
    function($scope, $state, UserService) {
        $scope.setUserType = function(type) {
            UserService.set("userType", type);
            console.log(UserService.get("userType"));
            $state.go('welcome', {
                "type": type
            });
        };
    }
])*/

.controller('HomeController', ['$scope', '$state', 'UserService', 'DataService',
    function($scope, $state, UserService, DataService) {
         
    
        // if(UserService.get("userStatus")){
        //     $state.go('seek');
        // }

        $scope.setUserType = function(type) {
            UserService.set("userType", type);
            console.log(UserService.get("userType"));

            if (UserService.get("userType") === 'C') {
                DataService.geoAPI(function() {
                    console.log('After geo called inside guestSignIn of HomeController');
                    $state.go('list');
                });
            } else {
                if (UserService.get("userType") === 'N') {
                    if(UserService.get("userStatus")){
                        console.log('hi');
                        $state.go('seek');
                    }
                    else{
                        console.log('hi');
                        $state.go('signIn');
                    }
                }
            }
        };
    }
])

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
                    DataService.searchAPI(latitude, longitude, function() {
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
$scope.form = {};
 $scope.frm = {};
  $scope.errortext = "";
       
    if (UserService.get("userStatus")) {
        $scope.cause = null;
        console.log('putserviceCtrl called');
        $scope.requirement = [];
        $scope.category = null;
        $scope.product = null;
        $scope.quantity = null;

        $scope.putdata = function(frm) {
               if (frm.cause != null && frm.category != null && frm.product != null && frm.quantity != null) {
            var data = {
                cause: frm.cause,
                requirement: [{
                    reqId: new Date().getTime().toString(),
                    category: frm.category,
                    product: frm.product,
                    quantity: frm.quantity,
                    status: true
                }]
            };
       

            var ngoId = UserService.get("ngoId");
            console.log(UserService.get("userId"));
            console.log("NGOId", ngoId);

            $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId")) + '/event', data).then(function(response) {
                if (response.data)
                    $scope.msg = "Put Data Method Executed Successfully!";
                 $scope.reset();
                 $scope.reloadPage();

            });

            $state.go('seek',{reload: true});
        } else{
             $scope.errortext = "All Fields are necessary";
        }
        };
    } else {
        $state.go('home');
    }

   $scope.reset = function() {
   $scope.frm = {};
      $scope.form.signInForm.$setPristine();
};

    $scope.reloadPage = function(){
        window.location.reload();
    }

}])


.controller('GetController', ['$scope', '$http', '$state', 'UserService', function($scope, $http, $state, UserService) {

   
    console.log(UserService.get("userSatus"));
    if (UserService.get("userStatus")) {
        console.log(UserService.get("ngoId"));
        $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId"))).success(function(data) {
            console.log(data);

            $scope.charity = data;
            $scope.event = data.charityEvent;

            console.log('event', $scope.charity);
        });
    } else {
        $state.go('home');
    }

     $scope.Update = function(reqId) {
        console.log(reqId);
        console.log("userid-ngo", UserService.get("ngoId"));
        $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId")) + '/delete/' + encodeURI(reqId)).then(function(response) {
            if (response.data)
                $scope.msg = "Put Data Method Executed Successfully!";
        });
    };
}])


.controller('WelcomeCtrl', function($scope, $state, $cookieStore, $http, UserService, DataService) {
    $scope.userType = UserService.get("userType");
   
    if(UserService.get("userStatus")===undefined){
         UserService.set("userStatus", false);
        }
    $scope.userStatus =  UserService.get("userStatus");
    $scope.guestSignin = function() {

        if (UserService.get("userType") === 'C') {
            DataService.geoAPI(function() {
                console.log('After geo called inside guestSignIn of welcomeCtrl');
                $state.go('list');
            });
        } else {
            if (UserService.get("userType") === 'N') {

                $state.go('welcome');
            } else {
                $state.go('welcome');
            }
        };
    };


    $scope.Signin = function(emailId, password) {
        debugger;
        $scope.errortext = "";
        if (emailId != null && password != null) {
            var data = {
                emailId: emailId,
                password: password

            };
            console.log("***data from page ****", data);

            $http.post('https://csrsample.herokuapp.com/login', data).success(function(response) {
                console.log("userid from response", response.userId);


                if (response.userId == "N" || response.userId == "W") {
                    $scope.errortext = "Invalid username or password. Please try again";
                    $state.go('signIn');

                } else {

                    UserService.set("userId", response.userId);
                    var ngoId = "csr" +response.userId;
                     console.log("ngoId", ngoId);
                    UserService.set("ngoId", ngoId);
                    UserService.set("userStatus", true);
                    $scope.userStatus =  UserService.get("userStatus");
                     $scope.reloadPage();
                    console.log("User", UserService.get("userId"), "Response", response);
                    $scope.show_menu = false;
                    $state.go('seek');

                }
            })
        }
        else{
        	
        	$scope.errortext = "Username and Password can't be empty";
        }

    };




    $scope.user = $cookieStore.get('userInfo');
   
    $scope.logout = function() {
        console.log('In logout');
        $cookieStore.remove("userInfo");
        console.log("Hello");
        console.log('userInfo');
        UserService.set("userStatus", false);
        $scope.userStatus =  UserService.get("userStatus");
        $scope.reloadPage();
        $state.go('home');
        UserService.remove("userStatus");
        UserService.remove("userId");
        UserService.remove("userType");
        
        $window.location.reload();

    };


  $scope.reloadPage = function(){
        window.location.reload();
    }

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



        gapi.client.setApiKey(null);
        gapi.client.load('plus', 'v1', function() {});
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
                    var user = {};
                    user.userName = resp.displayName;
                    user.userId = resp.id;
                    UserService.set("userId", resp.id);
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
                });
            }
        }
    };
    // END Google Plus Login




})

.controller('dashboardCtrl', function($scope, $window, $state, $cookieStore, UserService, DataService) {


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
                $state.go('home');
            }
        }
        $window.location.reload();

    };
})

.service('DataService', function($http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    var that = this;
    this.apiData = [];

    this.getApiData = function() {
        console.log('getApiData', this.apiData);
        return this.apiData;
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

    this.searchAPI = function(lat, long, cb) {
        console.log('in search');


        $http.get('https://csrsample.herokuapp.com/calculateDistance/' + encodeURI(lat) + '/' + encodeURI(long)).success(function(data) {
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