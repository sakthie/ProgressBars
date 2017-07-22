var singtelApp = angular.module('singtelApp', ['ui.bootstrap', 'ngAnimate', "restServiceModule", 'angular-growl']);

/*To show Error Notification*/
singtelApp.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
}]);





singtelApp.controller('ProgressController', function ($scope, restService, $timeout, growl) {
    /*RestAPI Call*/
    $scope.progressBarList = restService.getProgressList(success, error);
    $scope.greeting = "Welcome!";

    /*RestAPI Success Method*/
    function success(response) {
        if (response.data != null) {
            $scope.response = response;
            $scope.limit = parseFloat(response.data.limit);
            $scope.bars = response.data.bars;
            $scope.buttons = response.data.buttons;
            $scope.finalbars = [];
            angular.forEach($scope.bars, function (value, key) {
                $scope.finalbars.push({
                    value: Math.round( parseInt($scope.bars[key] / $scope.limit * 100)),
                    type: "#progress " + key,
                    bartype: "success"
                });
            });
        }
    }

    /*RestAPI Error Method*/
    function error(response) {
        console.log(response);
        $scope.valid = false;
    }

    /*Button Click*/
    $scope.loadProgress = function (value) {
        var buttonValue = parseInt(value);
        if ($scope.progresstype != undefined) {
            angular.forEach($scope.finalbars, function (value, key) {
                if ($scope.finalbars[key].type.toLowerCase() == $scope.progresstype.type.toLowerCase()) {
                    $scope.finalbars[key].value = Math.round(parseInt(parseInt($scope.progresstype.value) + buttonValue));
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

describe("init", function () {
    beforeEach(module('singtelApp'));
    var ProgressController,
        scope;
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        HelloWorldController = $controller('ProgressController', {
            $scope: scope
        });
    }));
    it('says Welcome!', function () {
        expect(scope.greeting).toEqual("Welcome!");
    });

});


describe("Services", function () {
    beforeEach(module("singtelApp"));
    describe("ProgressBar Services", function () {
        var service, $httpBackend;
        beforeEach(inject(function ($injector21) {
            service = $injector.get('restService');
            it('not null', function () {
                expect(service).not.toBe(null);
            });

            it('success', function () {
                var callback = function () {
                    var json = parse(scope.response);
                    success(json);
                }
            });
        }));
        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
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