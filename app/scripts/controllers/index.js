'use strict';

angular.module('skillMgmtApp').controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, auth, alert) {

    auth.user.$promise.then(function () {
        $scope.skills.$promise.then(function () {

            if ($scope.skills.skills.length > 0) {
                $scope.active.skill;
                $state.go('form_submission_list', {eventId: $scope.active.skill.event.id, skillId: $scope.active.skill.id});
            } else {
                $state.go('sorry');
            }
            
        }, function () {
            $state.go('sorry');
        });
    });

});
