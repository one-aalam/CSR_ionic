
angular.module('starter', ['ngCookies', 'ionic'])


.run(function ($rootScope, $cookieStore, $state, $ionicPlatform,$window) {

     $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      console.log('in cordova');
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      $rootScope.$on('$stateChangeStart', function (event, next, current) {
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
    if(window.StatusBar) {
      StatusBar.styleDefault();
      console.log('in cordova');
    }
 })  

})

.service("UserService", function () {

  this.get = function (key) {
    return window.localStorage.getItem(key);
  };
  this.set = function (key, id) {
    window.localStorage.setItem(key, id);
    return true;
  };
  this.remove = function (key) {
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
           /*resolve: function (UserService) {
            console.log(UserService.get());
           }*/
         
       
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

     .state('guest', {
       url: '/guest',
       
        templateUrl: "templates/welcome.html",
        controller: 'GuestController'
         
       
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

  $urlRouterProvider.otherwise('/home');
})

.service("UserService", function () {

  this.get = function (key) {
    return window.localStorage.getItem(key);
  };
  this.set = function (key, id) {
    window.localStorage.setItem(key, id);
    return true;
  };
  this.remove = function (key) {
    window.localStorage.removeItem(key);
    return true;
  }
  return this;
}) 

.controller('CustomerController', ['$scope','$state','UserService',
  function($scope,$state,UserService){
    $scope.setUserType = function() {
        UserService.set("userType",'C');
        console.log(UserService.get("userType"));
        $state.go('welcome');
      };
  }
 ])

.controller('NGOController', ['$scope','$state','UserService',
  function($scope,$state,UserService){
    $scope.setUserType = function() {
        UserService.set("userType",'N');
        console.log(UserService.get("userType"));
        $state.go('welcome');
      };
  }
 ])


.controller('GuestController', ['$scope','$state','$window','UserService',
  function($scope,$state,$window,UserService){
    console.log('in guest');
    $scope.callFun = function () {
      alert("hey");
      if (UserService.get("userType") == 'C') {
            $state.go('list');
        }
        else{
           if (UserService.get("userType") == 'N'){
            $window.alert('Please log in to continue.');
            $state.go('welcome');
           }
           else{
            $state.go('welcome');
        }
     };
    }
    
  }
 ])

.controller('ListController', ['$scope', '$http', '$state','UserService',
    function($scope, $http, $state,UserService) {

      console.log('userId : ');
      console.log(UserService.get("userId"));

    $http.get('https://csrsample.herokuapp.com/charity').success(function(data) {
      
      $scope.ngo = data;
      console.log('List Controller called');
      console.log(data);
      
      /*$scope.whichngo=$state.params.ngoName;
      console.log($scope.whichngo);*/

      /*$scope.doRefresh =function() {
      $http.get('https://csrsample.herokuapp.com/charity').success(function(data) {
          $scope.ngo = data.ngo;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      }*/

    });
  
}])

.controller('DetailController', ['$scope', '$http', '$state',
    function($scope, $http, $state) {

      $scope.ngoId = $state.params.ngoId;
      $http.get('https://csrsample.herokuapp.com/charity/'+ encodeURI($scope.ngoId)).success(function(data) {
        console.log('api call successful');
        $scope.charity = data;
        console.log($scope.charity);
        
      });
}])


.controller('putserviceCtrl',['$scope','$http','$state','UserService', function($scope, $http,$state,UserService) {
  
 if(UserService.get("userStatus")=='A'){
 $scope.cause = null;

 $scope.setUserType = function(){
        $scope.userType = 'N';
        console.log($scope.userType);
      };

console.log('putserviceCtrl called');        

 $scope.requirement = [];
 $scope.category = null;
 $scope.product = null;
 $scope.quantity = null;


// $scope.requirement = [];

 console.log()
 $scope.putdata = function (cause, category, product, quantity) {
  
 
  var data = {
       cause: cause,
       requirement: [{
            category: category,
            product: product,
            quantity: quantity,
            status: true
       }]};

   var ngoId = UserService.get("userId");
        console.log(UserService.get("userId"));
        console.log("NGOId", ngoId);

  $http.put('https://csrsample.herokuapp.com/charity/'+encodeURI(UserService.get("userId"))+'/event', data).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
       }); 

  $state.go('seek');
      
      
    };
  
}
else {
    
    $state.go('home');
  }
  
}])


.controller('GetController',['$scope', '$http','$state', 'UserService', function($scope, $http,$state,UserService) {

  $scope.Update = function(reqId){
      console.log(reqId);
      // if(item)
      //   item.status = false;

      console.log("userid",UserService.get("userId"));

       $http.put('https://csrsample.herokuapp.com/charity/'+encodeURI(UserService.get("userId"))+'/delete/'+ encodeURI(reqId)).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
       }); 
  };
  console.log(UserService.get("userSatus"));
  if(UserService.get("userStatus")=='A'){
  $scope.pageData = {
    charity: "",
    event: "",
    requirement: ""
  };$http.get('https://csrsample.herokuapp.com/charity/'+encodeURI(UserService.get("userId"))).success(function(data){
    console.log(data);
  //   $scope.change = function(event,item) {
  //   if(item.isChecked){
  //     event.preventDefault;
  //   }
  //   else{
  //     return(item.category, item.product, item.quantity);
  //   }
  // }
    
    $scope.charity = data;
    $scope.event = data.charityEvent;
    $scope.requirement = event.requirement;

    console.log(event);
  });
}
else{

  $state.go('home');
}
}])





.controller('welcomeCtrl', function ($scope, $state, $cookieStore,$http, UserService) {


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
                    var user = {};
                    user.userName = response.name;
                    /*user.email = userEmail;*/
                    /*user.email = resp.emails;*/
                    user.userId = response.id;
                    user.userStatus = 'A';
                    UserService.set("userId", response.id);
                    //$rootScope.userId = resp.id;
                    UserService.set("userStatus", 'A');
                    console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                    /*$rootScope.userId = response.id;
                    $rootScope.userStatus ='A';*/
                    
                   /* user.profilePic = picResponse.data.url;*/
                   $http.get('https://csrsample.herokuapp.com/users').success(function(data) {
                    if(!data)
                    {
                      $http.post('https://csrsample.herokuapp.com/users', user).then(function (response) {
                         if (response.data)
                            $scope.msg = "Api Call successfull";
                            console.log('Success---------');
                          });
                          $cookieStore.put('userInfo', user);
                          $state.go('dashboard');
                    }
                    else
                    {
                      for ( var i = 0; i < data.length; i++)
                       { 
                        console.log('inside for');
                        var obj = data[i]; 
                        console.log(obj); 
                        if (obj.userId == user.userId)
                        {
                          console.log('inside if');
                          /*$state.go('list');*/
                          $cookieStore.put('userInfo', user);
                          $scope.flag = 1;
                          break;
                        }
                      }

                      if($scope.flag==1 ){
                        if(UserService.get("userType") == 'C'){
                        $state.go('list');
                        }

                        else if(UserService.get("userType") == 'N'){
                          $state.go('seek');
                        }
                      }
                      else{
                         $http.post('https://csrsample.herokuapp.com/users', user).then(function (response) {
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
                    user.userName = resp.displayName;
                    /*user.email = userEmail;*/
                    /*user.email = resp.emails;*/
                    user.userId = resp.id;

                    user.userStatus = 'A';
                    UserService.set("userId", resp.id);
                    //$rootScope.userId = resp.id;
                    UserService.set("userStatus", 'A');
                    console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                   // $rootScope.userStatus = 'A';
               


                    $http.get('https://csrsample.herokuapp.com/users').success(function(data) {
                    if(!data)
                    {
                      $http.post('https://csrsample.herokuapp.com/users', user).then(function (response) {
                         if (response.data)
                            $scope.msg = "Api Call successfull";
                            console.log('Success---------');
                          });
                          $cookieStore.put('userInfo', user);
                          $state.go('dashboard');
                    }
                    else
                    {
                      for ( var i = 0; i < data.length; i++)
                       { 
                        console.log('inside for');
                        var obj = data[i]; 
                        console.log(obj); 
                        if (obj.userId == user.userId)
                        {
                          console.log('inside if');
                          /*$state.go('list');*/
                          $cookieStore.put('userInfo', user);
                          $scope.flag = 1;
                          break;
                        }
                      }

                       if($scope.flag==1 ){
                        if(UserService.get("userType") == 'C'){
                        $state.go('list');
                        }

                        else if(UserService.get("userType") == 'N'){
                          $state.go('seek');
                        }
                      }
                      else{
                         $http.post('https://csrsample.herokuapp.com/users', user).then(function (response) {
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

// Dashboard/Profile Controller
.controller('dashboardCtrl', function ($scope, $window, $state, $cookieStore, $ionicActionSheet,$ionicLoading,UserService) {
    // Set user details
    $scope.user = $cookieStore.get('userInfo');

    
    // Logout user
    $scope.logout = function () {
      console.log('In logout');
        $cookieStore.remove("userInfo");
        console.log("Hello");
        console.log('userInfo');
        //$rootScope.userStatus = 'T';
        UserService.set("userStatus", 'T');
        $state.go('welcome');
        UserService.remove("userStatus");
        UserService.remove("userId");
        UserService.remove("userType");

        
        $window.location.reload();
      
    };

    $scope.submit = function () {
      console.log('In submit');
        if (UserService.get("userType") == 'C') {
            $state.go('list');
        }
        else{
           if (UserService.get("userType") == 'N'){
             $state.go('seek');
           }
           else{
            $state.go('welcome');
           }
        }
 
        
        $window.location.reload();
        
    };
});
