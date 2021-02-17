'use strict';

angular.module('skillMgmtApp').controller('SkillCtrl', function($scope, $stateParams, $q, WorldSkills, WORLDSKILLS_API_SKILLMAN_CODE, WORLDSKILLS_WEB_PROTOCOL, WORLDSKILLS_WEB_DOMAIN, auth, Event, Skill, Resource) {

    $scope.WorldSkills = WorldSkills;
    $scope.WORLDSKILLS_WEB_PROTOCOL = WORLDSKILLS_WEB_PROTOCOL;
    $scope.WORLDSKILLS_WEB_DOMAIN = WORLDSKILLS_WEB_DOMAIN;

    var DOCUMENT_TYPE_TECHNICAL_DESCRIPTION = 4;
    var DOCUMENT_TYPE_HALL_LAYOUTS = 6;
    var DOCUMENT_TYPE_HEALTH_SAFETY_ENVIRONMENT = 20;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {});

    $q.all([$scope.event.$promise, $scope.skill.$promise]).then(function() {

        var tags = [];
        tags.push($scope.event.code ? $scope.event.code : $scope.event.name);
        tags.push('Skill ' + $scope.skill.number);

        $scope.technicalDescription = Resource.query({type: DOCUMENT_TYPE_TECHNICAL_DESCRIPTION, tags: tags, limit: 1});
        $scope.workshopLayouts = Resource.query({type: DOCUMENT_TYPE_HALL_LAYOUTS, tags: tags, limit: 1});
        $scope.healthSafetyEnvironment = Resource.query({type: DOCUMENT_TYPE_HEALTH_SAFETY_ENVIRONMENT, tags: tags, limit: 1});

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewManagementPlan'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewManagementPlan = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillItems = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSubmissions'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSubmissions = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditLunch'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditLunch = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewTimetable', $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewTimetable = true;
            }
        });

    });

});