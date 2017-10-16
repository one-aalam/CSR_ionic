angular.module('myAppDaoModule2', []).controller('ListController', ['$scope', '$http', '$state', 'DataService',
    function ($scope, $http, $state, DataService) {

        console.log('Inside List Controller');
        $scope.ngo = DataService.getApiData();
        console.log('ngo', $scope.ngo);

        $scope.GetLocation = function (address) {
            console.log('Inside GetLocation');
            var geocoder = new google.maps.Geocoder();
            var address = address;
            console.log('address', address);
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    console.log('lat', latitude, 'long', longitude);
                    DataService.searchAPI(latitude, longitude, function () {
                        console.log('get API data called after search');
                        $scope.ngo = DataService.getApiData();
                        console.log("shilpa :"+ $scope.ngo);
                    });
                } else {
                    console.log("Request failed.");
                }
            });
        };
    }
]);