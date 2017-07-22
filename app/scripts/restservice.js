(function (ng) {
    var utils = ng.module("restServiceModule", []);

    utils.factory("restService", ["$http", "$q", function ($http, $q, filterFilter) {
        var URL = "http://pb-api.herokuapp.com/bars";
        return {
            getProgressList: function (successCallback, errorCallback) {
                $http.get(URL).then(successCallback, errorCallback);
            }
        };
    }]);
})(angular);