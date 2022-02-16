'use strict';

angular.module('skillMgmtApp').controller('ReportProgressItems', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $uibModal, auth, alert, Event, Skill, ProgressItem, SkillProgressItem) {

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

});

