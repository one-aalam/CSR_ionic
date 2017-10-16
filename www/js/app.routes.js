var app = angular.module('myAppRouter', ['ui.router']);

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

        .state('SignIn', {
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

