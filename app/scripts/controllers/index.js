'use strict';

angular.module('skillMgmtApp').controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, auth, alert) {

    if ($scope.active.skill) {

        $state.go('skill_plan.day', {eventId: $scope.active.skill.event.id, skillId: $scope.active.skill.id, day: 'C1'});

    } else {

        $state.go('events');

    }

});
