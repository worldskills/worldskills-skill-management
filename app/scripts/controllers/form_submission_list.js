'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionListCtrl', function ($scope, $rootScope, auth, PersonSkills, EventForms) {

    var eventId = 10;

    auth.user.$promise.then(function () {
        $scope.skills = PersonSkills.get({eventId: eventId, personId: auth.user.person_id});
    });

    $scope.forms = EventForms.get({eventId: eventId});

        $scope.formList = $rootScope.formList;
        $scope.experts = $rootScope.experts;
        $scope.ce = $rootScope.ce;
        $scope.jp = $rootScope.jp;
});
