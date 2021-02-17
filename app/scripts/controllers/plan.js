'use strict';

angular.module('skillMgmtApp').controller('PlanCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, auth, alert, Plan, LunchPeriod) {

    $scope.loading = true;
    $scope.active.preview = true;

    $scope.plan = Plan.get({skillId: $stateParams.skillId}, {}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillItems'], $scope.plan.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillItems = true;
            }
        });

        var skill = $scope.plan.skill;
        $window.document.title = 'Skill Management Plan - ' + skill.event.name + ' - ' + skill.number + ' ' + skill.name.text;

        $scope.lunchPeriods = LunchPeriod.query({eventId: skill.event.id}, {}, function () {

            $scope.loading = false;

        });

        angular.forEach($scope.plan.competition_days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });

    });

    $scope.changeDay = function (day) {
        $state.go('.', {day: day.timeline}, {location: 'replace', notify: false});
        $scope.active.day = day;
    };

});
