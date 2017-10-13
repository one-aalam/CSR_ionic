var app = angular.module('starter', ['ngCookies', 'ionic', 'ngCordova', 'ngCordovaOauth'])
app.run(function ($rootScope, $cookieStore, $state, $ionicPlatform, $window) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      $rootScope.$on('$stateChangeStart', function (event, next, current) {
        var userInfo = $cookieStore.get('userInfo');
        if (!userInfo) {
          // user not logged in | redirect to loginA
          if (next.name !== "welcome") {

            // not going to #welcome, we should redirect now
            event.preventDefault();
            $state.go('welcome');
          }
        } else if (next.name === "welcome") {

          event.preventDefault();
          $state.go('dashboard');
        }
      })
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();

    }
  })
})

app.config(function ($stateProvider, $urlRouterProvider) {
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
      controller: 'PutController',
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
      controller: "DashboardCtrl"
    })
  $urlRouterProvider.otherwise('/home');
});
