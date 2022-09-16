'use strict';

angular.module('skillMgmtApp').controller('AdminSkillCtrl', function($scope, $stateParams, WORLDSKILLS_API_SKILLMAN_CODE, auth, Skill) {

    $scope.skill = Skill.get({id: $stateParams.skillId}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditExperts'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditExperts = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillProgressItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillProgressItems = true;
            }
        });
    });

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

angular.module('skillMgmtApp').controller('AdminSkillProgressCtrl', function($scope, $stateParams, $uibModal, $q, $timeout, SkillProgressItem) {

    $scope.skillId = $stateParams.skillId;

    $scope.items = SkillProgressItem.query({skillId: $scope.skillId});

    $scope.saved = false;
    $scope.saving = 0;

    var timeouts = {};
    $scope.itemChanged = function (item) {
        var updateItem = function () {
            $scope.saving++;
            SkillProgressItem.update({skillId: $scope.skillId, progressItemId: item.progress_item.id}, item, function () {
              $scope.saved = true;
              $scope.saving--;
            });
        };
        if (item.id in timeouts) {
            $timeout.cancel(timeouts[item.id]);
        }
        timeouts[item.id] = $timeout(updateItem, 1000);
    };

    $scope.changeStatus = function (item) {
        $scope.item = item;
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/admin_skill_progress_status.html',
            controller: 'AdminSkillProgressStatusCtrl',
            scope: $scope
        });

    };
});

angular.module('skillMgmtApp').controller('AdminSkillProgressStatusCtrl', function($scope, $uibModalInstance, SkillProgressItem) {

    $scope.confirmStatus = function (status) {
        $scope.item.status = status;
        SkillProgressItem.update({skillId: $scope.skillId, progressItemId: $scope.item.progress_item.id}, $scope.item, function () {
            $uibModalInstance.close();
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };
});
