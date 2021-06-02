'use strict';

angular.module('skillMgmtApp').controller('AdminSkillCtrl', function($scope, $stateParams, Skill) {

    $scope.skill = Skill.get({id: $stateParams.skillId});

});

angular.module('skillMgmtApp').controller('AdminSkillExpertsCtrl', function($scope, $stateParams, SkillExpert) {

    $scope.loading = true;

    $scope.experts = SkillExpert.query({skillId: $stateParams.skillId}, function () {
        $scope.loading = false;
    });

    $scope.expertChanged = function (expert) {
       SkillExpert.update({skillId: $stateParams.skillId}, expert);
    };

});

angular.module('skillMgmtApp').controller('AdminSkillFormSubmissionsCtrl', function($scope, $stateParams, SkillSubmission) {

    $scope.loading = true;

    $scope.submissions = SkillSubmission.query({skillId: $stateParams.skillId, state: 'submitted'}, function () {
        $scope.loading = false;
    });

});
