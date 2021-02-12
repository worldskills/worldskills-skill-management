'use strict';

angular.module('skillMgmtApp').controller('SkillCtrl', function($scope, $stateParams, WORLDSKILLS_API_SKILLMAN_CODE, auth, Skill) {

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewTimetable', $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewTimetable = true;
            }
        });

    });

});
