'use strict';

angular.module('skillMgmtApp').controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, auth, alert) {

    auth.user.$promise.then(function () {
        $scope.skills.$promise.then(function () {

            if ($scope.active.skill) {

                $state.go('skill_plan.day', {eventId: $scope.active.skill.event.id, skillId: $scope.active.skill.id, day: 'C1'});

            } else {

                if ($scope.userCanViewAllSubmissions || $scope.userCanEditForms) {
                    $state.go('admin');
                } else {
                    $state.go('sorry');
                }

            }

        }, function () {
            $state.go('sorry');
        });
    });

});
