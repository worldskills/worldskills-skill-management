'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionListCtrl', function ($scope, $rootScope, $state, $stateParams, $uibModal, auth, Skill, SkillForms) {

    $scope.loading = true;

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        auth.user.$promise.then(function () {
            $scope.skills.$promise.then(function () {
                $scope.active.skill = $scope.skill;
            });
        });

        $scope.forms = SkillForms.get({skillId: $scope.skill.id}, function () {
            $scope.loading = false;
        }, function () {
            // error
            $scope.loading = false;
        });

    }, function () {
        // error
        $scope.loading = false;
    });

    $scope.cancelSkillsModal = function () {
        $scope.skillsModal.dismiss('cancel');
    };

    $scope.changeSkill = function () {
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/form_submission_list_skills.html',
            size: 'sm',
            scope: $scope
        });
    };

});
