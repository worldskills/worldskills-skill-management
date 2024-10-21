'use strict';

angular.module('skillMgmtApp').controller('MainCtrl', function ($rootScope, $scope, $state, $translate, auth, alert, WORLDSKILLS_API_SKILLMAN_CODE, ENVIRONMENT_WARNING) {

    $scope.availableLanguages = {
        'en': 'English',
        'fr': 'Français',
        'fi': 'Suomi'
    };

    $scope.active = {};

    $scope.auth = auth;
    $scope.logout = function (e) {
        auth.logout();
    };
    $scope.date = new Date();

    auth.user.$promise.then(function () {
        if (auth.user.preferred_language) {
            $translate.use(auth.user.preferred_language);
        }
    });

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
