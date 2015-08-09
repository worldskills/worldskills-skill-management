'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionListCtrl', function ($scope, $rootScope, auth, PersonSkills, SkillForms, FormSubmission) {

    var eventId = 10;

    $scope.forms = {};
    $scope.loading = true;

    auth.user.$promise.then(function () {
        $scope.skills = PersonSkills.get({eventId: eventId, personId: auth.user.person_id}, function () {

            if ($scope.skills.skills.length == 0) {
                $scope.loading = false;
            }

            angular.forEach($scope.skills.skills, function (skill) {

                var skillId = skill.id;

                $scope.forms[skillId] = SkillForms.get({skillId: skillId}, function () {
                    $scope.loading = false;
                });

            });

        }, function () {
            // error
            $scope.loading = false;
        });
    });



});
