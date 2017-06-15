
angular.module('starter', ['ionic'])

/*.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
})*/

.run(["$ionicPlatform", "$window", function($ionicPlatform,$window) {
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
                  $window.plugins.googleplus.show(true);
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
}])

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
       
        
           templateUrl: 'templates/home.html',
           controller: 'LoginController'
         
       
    })

  $urlRouterProvider.otherwise('/home');
})

.controller('ListController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {
    $http.get('http://10.202.249.51:8080/charity').success(function(data) {
      $scope.ngo = data.ngo;
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

.controller('LoginController',function($scope, $state, $ionicLoading) {
  // This method is executed when the user press the "Sign in with Google" button

  $scope.googleSignIn = function() {
    console.log('Inside login controller');
    $ionicLoading.show({
      template: 'Logging in...'
    });  

    window.plugins.googleplus.login(
      {
        'webClientId': '374010870485-pq83isui0ccj4t1ts0elb8eo200ond3k.apps.googleusercontent.com',
        'offline': true

      },
     
    function (user_data) {
      console.log(user_data)
      var data = {
      userId: user_data.userId,
      userName: user_data.displayName,
      userType : 'C'
      /*email: user_data.email,
      picture: user_data.imageUrl,
      accessToken: user_data.accessToken,
      idToken: user_data.idToken*/
      };
      console.log(data);
      $http.post('http://10.202.249.51:8080/users', data)

      $ionicLoading.hide();
      $state.go('home');
      },
      function (msg) {
      $ionicLoading.hide();
      }
    );
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
