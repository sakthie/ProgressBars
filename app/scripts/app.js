var singtelApp = angular.module('singtelApp', ['ui.bootstrap', 'ngAnimate', "restServiceModule", 'angular-growl']);

/*To show Error Notification*/
singtelApp.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
}]);




