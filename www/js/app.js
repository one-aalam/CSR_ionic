// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/*.run(["$ionicPlatform", "$window", function($ionicPlatform,$window) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.plugins && window.plugins.googleplus) {
            window.plugins.googleplus.isAvailable(
                function (available) {
                if (available) {
                  /*$window.plugins.googleplus.show(true);
                    // show the Google+ sign-in button
                    console.log('available')
                  }
                  else{
                    console.log('not available')
                }
            });
        }
        else{
          console.log('window.plugins.googleplus not found')
        }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])*/
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    // .state('tabs', {
    //   url: '/tab',
    //   abstract: true,
    //   templateUrl: 'templates/tabs.html'
    // })

    // .state('tabs.home', {
    //   url: '/home',
    //   views: {
    //     'list-tab' : {
    //       templateUrl: 'templates/home.html',
    //       controller: 'LoginController'
    //     }
    //   }
    // })

    /*.state('tabs.home', {
      url: '/home',
      views: {
          templateUrl: 'templates/home.html',
          controller: 'ListController'
        
      }
    })*/

    // .state('tabs.list', {
    //   url: '/list',
    //   views: {
    //     'list-tab' : {
    //       templateUrl: 'templates/list.html',
    //       controller: 'ListController'
    //     }
    //   }
    // })

    // .state('tabs.detail', {
    //   url: '/list/:userId',
    //   views: {
    //     'list-tab' : {
    //       templateUrl: 'templates/detail.html',
    //       controller: 'ListController'
    //     }
    //   }
    // })

     .state('list', {
       url: '/list',
       
           templateUrl: 'templates/list.html',
           controller: 'ListController'
         
       
     })

     .state('detail', {
       url: '/list/:ngoName',
       
        
           templateUrl: 'templates/detail.html',
           controller: 'ListController'
         
       
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
       
        
           templateUrl: 'templates/home.html',
           controller: 'ListController'
         
       
    })

  $urlRouterProvider.otherwise('/list');
})

.controller('ListController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://10.202.249.51:8080/charity').success(function(data) {
      $scope.ngo = data.ngo;
      console.log(data);
      $scope.whichngo=$state.params.ngoName;

      $scope.doRefresh =function() {
      $http.get('http://10.202.249.51:8080/charity').success(function(data) {
          $scope.ngo = data.ngo;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      }

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
  $http.post('http://localhost:8080/charity/Cry111/event', data).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
       }); //put

    };
}])


.controller('GetController',['$scope', '$http', function($scope, $http) {
  $http.get('http://localhost:8080/charity/Cry').success(function(data){
    console.log(data);
    $scope.charity = data;
    $scope.event = data.charityEvent;
    $scope.requirement = event.requirement;
  });
}]);

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
})*/

/*.service('UserService', function() {
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

/*.controller('ListController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://10.202.249.51:8080/charity').success(function(data) {
      $scope.ngo = data.ngo;
      console.log(data);
      $scope.whichngo=$state.params.userId;

      $scope.doRefresh =function() {
      $http.get('http://10.202.249.51:8080/charity').success(function(data) {
          $scope.ngo = data.ngo;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      }

    });
}])*/