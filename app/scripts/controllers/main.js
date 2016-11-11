'use strict';

angular.module('skillMgmtApp').controller('MainCtrl', function ($rootScope, $scope, $state, $translate, Language, auth, alert, PersonSkills, WORLDSKILLS_API_SKILLMAN_CODE) {

    $scope.selectedLanguage = Language.selectedLanguage;

    $scope.auth = auth;
    $scope.logout = function (e) {
        auth.logout();
    };
    $scope.date = new Date();

    $scope.$on('$stateChangeStart', function () {
        alert.clear();
    });

    $scope.userCanEditForms = false;
    auth.user.$promise.then(function () {

        angular.forEach(auth.user.roles, function (role) {

            if (role.name == 'Admin' && role.role_application.application_code == WORLDSKILLS_API_SKILLMAN_CODE)
            {
                $scope.userCanViewAllSubmissions = true;
                $scope.userCanEditForms = true;
            }

            if (role.name == 'ViewAllSubmissions' && role.role_application.application_code == WORLDSKILLS_API_SKILLMAN_CODE)
            {
                $scope.userCanViewAllSubmissions = true;
            }

            if (role.name == 'EditForms' && role.role_application.application_code == WORLDSKILLS_API_SKILLMAN_CODE)
            {
                $scope.userCanEditForms = true;
            }
        });

        $scope.active = {};

        $scope.skills = PersonSkills.get({personId: auth.user.person_id}, function () {

            if ($scope.skills.skills.length != 0) {
                $scope.active.skill = $scope.skills.skills[0];
                $scope.userHasSkillPosition = true;
            }

        }, function () {
            // error
            $scope.loading = false;
        });
    });

});
