var app = angular.module('myAppRouter', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'templates/list.html',
            controller: 'CharityListController'
        })

        .state('detail', {
            url: '/list/:ngoId',
            templateUrl: 'templates/detail.html',
            controller: 'DetailNgoController'
        })

        .state('seek', {
            url: '/seek',
            templateUrl: 'templates/seek.html'
        })

        .state('raiseRequest', {
            url: '/raiseRequest',
            templateUrl: 'templates/raiseRequest.html',
            controller: 'charityRaiseReqCtrl',
        })

        .state('updateRequest', {
            url: '/updateRequest',
            templateUrl: 'templates/updateRequest.html',
            controller: 'charityDetailCtrl'
        })

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        })

        .state('welcome', {
            url: "/welcome",
            templateUrl: "templates/welcome.html",
            controller: 'UserSignInCtrl',
            cache: false
        })

        .state('signIn', {
            url: "/signIn",
            templateUrl: "templates/SignIn.html",
            controller: 'UserSignInCtrl',
            cache: false
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "templates/dashboard.html",
            controller: "DashboardCtrl"
        })
    $urlRouterProvider.otherwise('/home');
});

