'use strict';

angular.module('skillMgmtApp').controller('PlanCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, auth, alert, Plan, LunchPeriod) {

    $scope.loading = true;

    $scope.activeDay = $stateParams.day;

    $scope.plan = Plan.get({skillId: $stateParams.skillId}, {}, function () {

        $scope.lunchPeriods = LunchPeriod.query({eventId: $scope.plan.skill.event.id}, {}, function () {

            $scope.loading = false;

        });

    });

    $scope.changeDay = function (day) {
        $state.go('.', {day: day.timeline}, {notify: false});
    };

});
