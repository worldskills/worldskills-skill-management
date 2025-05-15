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

angular.module('skillMgmtApp').controller('AdminSkillExpertNominationsCtrl', function($scope, $stateParams, $state, $translate, alert, SkillExpert, PeoplePerson, SMTElectionVote) {

    $scope.loading = true;
    $scope.createPollLoading = false;

    $scope.experts = SkillExpert.query({skillId: $stateParams.skillId}, function () {

        angular.forEach($scope.experts.registration_people, function (expert) {
            PeoplePerson.get({id: expert.person.id, include_history: 1}, function (person) {
                expert.history = [];
                angular.forEach(person.positions, function (position) {
                    if (position.timestamp_end !== null && (position.position.name.text === 'Expert' || position.position.name.text === 'Expert Lead' || position.position.name.text === 'Deputy Chief Expert' || position.position.name.text === 'Chief Expert')) {
                        expert.history.push(position);
                    }
                });
            });
        });


        $scope.votes = SMTElectionVote.query({skillId: $stateParams.skillId}, function () {
            $scope.votes.votes.forEach(function (vote) {
                angular.forEach($scope.experts.registration_people, function (expert) {
                    if (vote.voter.id === expert.person.id) {
                        expert.vote = vote;
                    }
                });
            });
        });

        $scope.loading = false;
    });

    $scope.expertChanged = function (expert) {
       SkillExpert.update({skillId: $stateParams.skillId}, expert);
    };

    $scope.getNominatedTotal = function () {
        if ($scope.experts.registration_people) {
            return $scope.experts.registration_people.reduce(function (sum, expert) {
                if (expert.nominated_smt) {
                    sum += 1;
                }
                return sum;
            }, 0);
        }
        return 0;
    };

    $scope.createPoll = function () {
        SMTElectionVote.updateState({skillId: $stateParams.skillId}, {smt_election_state: 'IN_PROGRESS'}, function () {
            $scope.skill.smt_election_state = 'IN_PROGRESS';
        });
    };
    $scope.closePoll = function () {
        SMTElectionVote.updateState({skillId: $stateParams.skillId}, {smt_election_state: 'COMPLETED'}, function () {
            $scope.skill.smt_election_state = 'COMPLETED';
        });
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
