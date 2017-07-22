var singtelApp = angular.module('singtelApp', ['ui.bootstrap', 'ngAnimate', "restServiceModule", 'angular-growl']);

/*To show Error Notification*/
singtelApp.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
}]);





singtelApp.controller('ProgressController', function ($scope, restService, $timeout, growl) {
    /*RestAPI Call*/
    var progressBarList = restService.getProgressList(success, error);

    /*RestAPI Success Method*/
    function success(response) {
        if (response.data != null) {
            $scope.limit = parseFloat(response.data.limit);
            $scope.bars = response.data.bars;
            $scope.buttons = response.data.buttons;

            $scope.finalbars = [];
            angular.forEach($scope.bars, function (value, key) {
                $scope.finalbars.push({
                    value: parseFloat($scope.bars[key] / $scope.limit * 100).toFixed(2),
                    type: "#progress " + key,
                    bartype: "success"
                });
            });
        }
    }

      /*RestAPI Error Method*/
    function error(response) {
        console.log(response);
    }

    /*Button Click*/
    $scope.loadProgress = function (value) {
        var buttonValue = parseFloat(value);
        if ($scope.progresstype != undefined) {
            angular.forEach($scope.finalbars, function (value, key) {
                if ($scope.finalbars[key].type.toLowerCase() == $scope.progresstype.type.toLowerCase()) {
                    var valuetoAdd = parseFloat(buttonValue / $scope.limit * 100);
                    $scope.finalbars[key].value = parseFloat(parseFloat($scope.progresstype.value) + valuetoAdd).toFixed(2);
                    if (parseFloat($scope.finalbars[key].value) < 0) {
                        $scope.finalbars[key].value = 0;
                    }
                    else if (parseFloat($scope.finalbars[key].value) > 100) {
                        $scope.finalbars[key].bartype = "danger";
                    }
                    else {
                        $scope.finalbars[key].bartype = "success";
                    }
                }
            });
        }
        else {
            growl.addErrorMessage('Please select Progress Bar!');
        }
    }
});
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