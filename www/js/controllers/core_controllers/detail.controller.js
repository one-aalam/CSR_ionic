angular.module('myAppCoreModule2', ['myAppConstants']).controller('DetailController',
    ['$scope', '$state', 'BaseService', 'CHARITY_ENDPOINT',
        function ($scope, $state, BaseService, CHARITY_ENDPOINT) {
            $scope.ngoId = $state.params.ngoId;
            $scope.charity = BaseService.getData(CHARITY_ENDPOINT + encodeURI($scope.ngoId));
            console.log("detailsctrl---"+$scope.ngoId+""+ $scope.charity);
        }
    ]);