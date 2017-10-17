angular.module('myAppDaoModule2', []).controller('CharityListController', ['$scope', '$http', '$state', 'DataService',
    function ($scope, $http, $state, DataService) {

        $scope.ngo = DataService.getApiData();

        $scope.GetLocation = function (address) {
            var geocoder = new google.maps.Geocoder();
            var address = address;
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    DataService.searchAPI(latitude, longitude, function () {
                        $scope.ngo = DataService.getApiData();
                    });
                } else {
                    
                }
            });
        };
    }
]);