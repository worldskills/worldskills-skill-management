'use strict';

angular.module('skillMgmtApp').controller('SkillCtrl', function($scope, $stateParams, $q, WorldSkills, WORLDSKILLS_API_SKILLMAN_CODE, WORLDSKILLS_WEB_PROTOCOL, WORLDSKILLS_WEB_DOMAIN, auth, Event, Skill, Resource) {

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {
    $scope.WORLDSKILLS_WEB_PROTOCOL = WORLDSKILLS_WEB_PROTOCOL;
    $scope.WORLDSKILLS_WEB_DOMAIN = WORLDSKILLS_WEB_DOMAIN;

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewManagementPlan', $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewManagementPlan = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewTimetable', $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewTimetable = true;
            }
        });

    });

});
