'use strict';

angular.module('skillMgmtApp').controller('ReportProgressItems', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $uibModal, auth, alert, Event, Skill, PeoplePerson, ProgressItem, SkillProgressItem) {

    $scope.loading = true;

    $scope.event = Event.get({id: $stateParams.eventId}, function () {
    });

    $scope.items = ProgressItem.get({eventId: $stateParams.eventId}, {}, function () {

        $scope.loading = false;

    });

    $scope.skills = Skill.query({event: $stateParams.eventId}, function () {
      
    });

    $scope.checkSkill = function (skill) {
        if (typeof skill.checked !== 'undefined' && skill.checked) {
          skill.checked = false;
        } else {
          skill.progress = SkillProgressItem.query({skillId: skill.id});
          skill.checked = true;
        }
    };

    var skillAdvisorPositionIdWSC2022SE = 534;

    $scope.skillAdvisors = PeoplePerson.query({event: $stateParams.eventId, position: skillAdvisorPositionIdWSC2022SE});

    $scope.checkSkillAvisor = function (skillAdvisor) {

        // uncheck all skills first
        angular.forEach($scope.skills.skills, function (skill) {
            skill.checked = false;
        });

        angular.forEach(skillAdvisor.positions, function (position) {
            if (position.position.id == skillAdvisorPositionIdWSC2022SE) {
                angular.forEach($scope.skills.skills, function (skill) {
                    if (skill.id == position.skill.id) {
                        skill.progress = SkillProgressItem.query({skillId: skill.id});
                        skill.checked = true;
                    }
                });
            }
        });
    };

});

