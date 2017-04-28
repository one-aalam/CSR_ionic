
angular.module('starter', ['ngCookies', 'ionic'])


.run(function ($rootScope, $cookieStore, $state, $ionicPlatform) {

     $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
    // Check login session
    // $rootScope.$on('$stateChangeStart', function (event, next, current) {
    //     var userInfo = $cookieStore.get('userInfo');
    //     if (!userInfo) {
    //         // user not logged in | redirect to login
    //         if (next.name !== "welcome") {
    //             // not going to #welcome, we should redirect now
    //             event.preventDefault();
    //             $state.go('welcome');
    //         }
    //     } else if (next.name === "welcome") {
    //         event.preventDefault();
    //         $state.go('dashboard');
    //     }
    // })
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    
     .state('list', {
       url: '/list',
       
           templateUrl: 'templates/list.html',
           controller: 'ListController'
         
       
     })

    .state('detail', {
       url: '/list/:ngoName',
       
        
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
           controller: 'putserviceCtrl'
         
       
    })


     .state('updateRequest', {
       url: '/updateRequest',
       
        
           templateUrl: 'templates/updateRequest.html',
           controller: 'GetController'
         
       
    })

    .state('home', {
       url: '/home',
       
        
           templateUrl: 'templates/home.html'
         
       
    })

     .state('welcome', {
        url: "/welcome",
        templateUrl: "templates/welcome.html",
        controller: 'welcomeCtrl'
        })

     .state('dashboard', {
        url: "/dashboard",
        templateUrl: "templates/dashboard.html",
        controller: "dashboardCtrl"
     })

  $urlRouterProvider.otherwise('/welcome');
})

.controller('ListController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://10.202.249.51:8080/charity').success(function(data) {
      $scope.ngo = data.ngo;
      console.log('hello');
      console.log(data);
      /*$scope.whichngo=$state.params.ngoName;
      console.log($scope.whichngo);*/

      $scope.doRefresh =function() {
      $http.get('http://10.202.249.51:8080/charity').success(function(data) {
          $scope.ngo = data.ngo;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      }

    });
}])

.controller('DetailController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {

      $scope.ngoName = $state.params.ngoName;
      $http.get('http://10.202.249.51:8080/charity/'+ encodeURI($scope.ngoName)).success(function(data) {
        console.log('api call successful');
        $scope.charity = data;
        console.log($scope.charity);
        
      });
}])


.controller('putserviceCtrl',['$scope','$http', function($scope, $http) {
 $scope.cause = null;
// $scope.requirement = [];
 console.log()
 $scope.putdata = function (cause) {
  var data = {
       cause: cause,
       // requirement: requirement,
       };
  $http.post('http://10.202.249.51:8080/charity/Cry111/event', data).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
       }); //put

    };
}])


.controller('GetController',['$scope', '$http', function($scope, $http) {
  $http.get('http://10.202.249.51:8080/charity/Cry').success(function(data){
    console.log(data);
    $scope.charity = data;
    $scope.event = data.charityEvent;
    $scope.requirement = event.requirement;

    console.log(event);
  });
}])

// .controller('LoginController',function($scope, $state, $ionicLoading) {
//   // This method is executed when the user press the "Sign in with Google" button

//   $scope.googleSignIn = function() {
//     console.log('Inside login controller');
//     $ionicLoading.show({
//       template: 'Logging in...'
//     });  

//     window.plugins.googleplus.login(
//       {
//         'webClientId': '374010870485-pq83isui0ccj4t1ts0elb8eo200ond3k.apps.googleusercontent.com',
//         'offline': true

//       },
     
//     function (user_data) {
//       console.log(user_data)
//       var data = {
//       userId: user_data.userId,
//       userName: user_data.displayName,
//       userType : 'C'
//       /*email: user_data.email,
//       picture: user_data.imageUrl,
//       accessToken: user_data.accessToken,
//       idToken: user_data.idToken*/
//       };
//       console.log(data);
//       $http.post('http://10.202.249.51:8080/users', data)

//       $ionicLoading.hide();
//       $state.go('home');
//       },
//       function (msg) {
//       $ionicLoading.hide();
//       }
//     );
//   };
// })



.controller('welcomeCtrl', function ($scope, $state, $cookieStore) {

    /**
     * SOCIAL LOGIN
     * Facebook and Google
     */
    // FB Login
    $scope.fbLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                getUserInfo();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'email,user_photos,user_videos'});

        function getUserInfo() {
            // get basic info
            FB.api('/me', function (response) {
                console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                // get profile picture
                FB.api('/me/picture?type=normal', function (picResponse) {
                    console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                    response.imageUrl = picResponse.data.url;
                    // store data to DB - Call to API
                    // Todo
                    // After posting user data to server successfully store user data locally
                    var user = {};
                    user.name = response.name;
                    user.email = response.email;
                    if(response.gender) {
                        response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                    } else {
                        user.gender = '';
                    }
                    user.profilePic = picResponse.data.url;
                    $cookieStore.put('userInfo', user);
                    $state.go('dashboard');

                });
            });
        }
    };
    // END FB Login

    // Google Plus Login
    $scope.gplusLogin = function () {
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
                var request = gapi.client.plus.people.get({'userId': 'me'});
                request.execute(function (resp) {
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
                    user.name = resp.displayName;
                    user.email = userEmail;
                    if(resp.gender) {
                        resp.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                    } else {
                        user.gender = '';
                    }
                    user.profilePic = resp.image.url;
                    $cookieStore.put('userInfo', user);
                    $state.go('dashboard');
                });
            }
        }
    };
    // END Google Plus Login

})

// Dashboard/Profile Controller
.controller('dashboardCtrl', function ($scope, $window, $state, $cookieStore) {
    // Set user details
    $scope.user = $cookieStore.get('userInfo');

    
    // Logout user
    $scope.logout = function () {
      console.log('In logout');

       // document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:8100"; 
        $cookieStore.remove("userInfo");
        console.log("Hello");
        console.log('userInfo');
        $state.go('welcome');
        $window.location.reload();
        



    };
});
/*.controller('LoginController',function($scope, $state, UserService, $ionicLoading) {
  // This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });  
    window.plugins.googleplus.login(
      {
        'webClientId': '374010870485-pq83isui0ccj4t1ts0elb8eo200ond3k.apps.googleusercontent.com',
        'offline': true
      },
      function (user_data) {
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
          
        });
        $ionicLoading.hide();
        $state.go('tabs.list');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };
})


.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

  var setUser = function(user_data) {
    window.localStorage.starter_google_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_google_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});*/

/*.service('UserService', ['$http','$scope' function($scope, $http) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

  var setUser = function(user_data) {
    $scope.userId = user_data.userID;
    $scope.userName = user_data.displayName;
    $scope.userType = "C";
    $scope.data ={

    }
    $http.post('http://10.202.249.51:8080/user')

    window.localStorage.starter_google_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_google_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
}]);
*/
