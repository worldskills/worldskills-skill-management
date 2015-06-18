'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionListCtrl', function ($scope, $rootScope, auth, Skills) {

    var eventId = 10;
    
    auth.user.$promise.then(function () {
        $scope.skills = Skills.get({eventId: eventId, personId: auth.user.person_id});
    });

        $scope.formList = $rootScope.formList;
        $scope.experts = $rootScope.experts;
        $scope.ce = $rootScope.ce;
        $scope.jp = $rootScope.jp;
});
