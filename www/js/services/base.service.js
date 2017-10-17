angular.module('myAppBaseServiceModule', ['myAppConstants']).service("BaseService", ['CSR_API_URI', '$http', function (baseURL, $http) {
    var that = this;
    this.response = [];

    // Generic HTTP GET call for all services
    this.getData = function (endpoint, encodedURI) {
        var URL;
        if (encodedURI == undefined) {
            URL = endpoint;
        }
        else {
            URL = endpoint + encodedURI;
        }
         $http.get(baseURL + URL).success(function (response) {
                that.response = response;
            });
        return that.response;
    };

    // Generic HTTP PUT call for all services
    this.putData = function (endpoint, encodedURI, subEndPoint, data) {
        $http.put(baseURL + endpoint + encodedURI + subEndPoint, data).then(function (response) {
            that.response = response;
        });
        return that.response;
    };

    // Generic HTTP POST call for all services
    this.postData = function (endpoint, encodedURI, subEndPoint, data) {
        var URL;
        if (encodedURI === undefined && subEndPoint === undefined) {
            URL = data;
        }
        else {
            URL = endpoint + encodedURI + subEndPoint;
        }
        $http.post(baseURL + endpoint + encodedURI + subEndPoint, data).then(function (response) {
            that.response = response;
        });
        return that.response;
    };
}]);
