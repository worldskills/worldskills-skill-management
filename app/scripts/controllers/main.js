'use strict';

angular.module('skillMgmtApp').controller('MainCtrl', function ($rootScope, $scope, $state, $translate, Language, auth, alert, WORLDSKILLS_API_SKILLMAN_CODE, ENVIRONMENT_WARNING) {

    $scope.selectedLanguage = Language.selectedLanguage;

    $scope.active = {};

    $scope.auth = auth;
    $scope.logout = function (e) {
        auth.logout();
    };
    $scope.date = new Date();

    $scope.$on('$stateChangeStart', function () {
        alert.clear();
    });

    $scope.userCanEditForms = false;

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'Admin').then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userIsAdmin = true;
            $scope.userCanViewAllSubmissions = true;
            $scope.userCanEditForms = true;
        }
    });

    $scope.environmentWarning = ENVIRONMENT_WARNING;

});
