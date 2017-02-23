'use strict';

angular.module('skillMgmtApp').controller('MainCtrl', function ($rootScope, $scope, $state, $translate, Language, auth, alert, PersonSkills, WORLDSKILLS_API_SKILLMAN_CODE) {

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
    $scope.userCanEditSkillItems = false;

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'Admin').then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userIsAdmin = true;
            $scope.userCanViewAllSubmissions = true;
            $scope.userCanEditForms = true;
            $scope.userCanEditCompetitionItems = true;
            $scope.userCanEditCompetitionDays = true;
            $scope.userCanEditRooms = true;
            $scope.userCanEditLunchPeriods = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewAllSubmissions', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanViewAllSubmissions = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditForms', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanEditForms = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditCompetitionItems', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanEditCompetitionItems = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditCompetitionDays', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanEditCompetitionDays = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditRooms', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanEditRooms = true;
        }
    });

    auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditLunchPeriods', 1).then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userCanEditLunchPeriods = true;
        }
    });

    auth.user.$promise.then(function () {

        $scope.skills = PersonSkills.get({personId: auth.user.person_id}, function () {

            if ($scope.skills.skills.length != 0) {
                $scope.active.skill = $scope.skills.skills[0];
            }

        }, function () {
            // error
            $scope.loading = false;
        });
    });

});
