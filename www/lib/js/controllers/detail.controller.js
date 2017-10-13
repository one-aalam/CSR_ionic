angular.module('starterDetailController', []).controller('DetailController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {

        $scope.ngoId = $state.params.ngoId;
        $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI($scope.ngoId)).success(function (data) {
            console.log('api call successful');
            $scope.charity = data;
            console.log($scope.charity);

        });
    }
]);