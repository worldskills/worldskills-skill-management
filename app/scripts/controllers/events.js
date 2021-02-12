'use strict';

angular.module('skillMgmtApp').controller('EventsCtrl', function($scope, $stateParams, Event) {

    $scope.loading = true;

    $scope.events = Event.query({type: 'competition'}, function () {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('EventCtrl', function($scope, $stateParams, WORLDSKILLS_API_SKILLMAN_CODE, auth, Event) {

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditForms', $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditForms = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewAllSubmissions', $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewAllSubmissions = true;
            }
        });

    });

});

angular.module('skillMgmtApp').controller('EventSkillsCtrl', function($scope, $stateParams, Skill) {

    $scope.skills = Skill.query({event: $stateParams.eventId});

});
