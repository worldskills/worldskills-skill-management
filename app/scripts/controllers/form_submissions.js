'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionsCtrl', function ($scope, $rootScope, $state, $stateParams, auth, ExpertSkills) {

    $scope.active.preview = true;

    auth.user.$promise.then(function () {

        $scope.skills = ExpertSkills.get({personId: auth.user.person_id}, function () {

            if ($scope.skills.skills.length != 0) {
                $state.go('form_submissions_skill', {formId: $stateParams.formId, skillId: $scope.skills.skills[0].id});
            }

        }, function () {
            // error
        });
    });
});

angular.module('skillMgmtApp').controller('FormSubmissionsSkillCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

    $scope.loading = true;
    $scope.active.preview = true;

    $scope.form = Form.get({id: $stateParams.formId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

    }, function () {
        // error
        $scope.loading = false;
    });

    $scope.submissions = SkillFormSubmission.query({formId: $stateParams.formId, skillId: $stateParams.skillId}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

});

angular.module('skillMgmtApp').controller('FormSubmissionsSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

    $scope.loading = true;
    $scope.active.preview = true;

    $scope.submission = SkillFormSubmission.get({formId: $stateParams.formId, skillId: $stateParams.skillId, id: $stateParams.id}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

});
