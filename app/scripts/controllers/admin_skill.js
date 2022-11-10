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

angular.module('skillMgmtApp').controller('AdminSkillExpertNominationsCtrl', function($scope, $stateParams, $state, alert, SkillExpert, Poll) {

    $scope.loading = true;

    $scope.experts = SkillExpert.query({skillId: $stateParams.skillId}, function () {
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

        var numberOfSelections = Math.min(3, $scope.getNominatedTotal());

        var experts = [];
        var options = [];
        var ces = [];
        angular.forEach($scope.experts.registration_people, function (expert) {
            experts.push(expert.person);
            if (expert.nominated_smt) {
                var name = expert.person.first_name + ' ' + expert.person.last_name;
                if (expert.member) {
                    name += ' ' + expert.member.code;
                }
                options.push({
                    'text': {
                        'lang_code': 'en',
                        'text': name
                    }
                });
                ces.push(name);
            }
        });

        if (confirm('Are you sure you want to create the poll for the Chief Expert election with these Experts?\n\n' + ces.join('\n') + '\n\n Click OK to proceed.')) {
    
            var poll = {
                start: new Date(),
                expiry: new Date(),
                entity: {
                    id: $scope.skill.entity_id
                },
                title: { lang_code: 'en', text: 'Chief Expert election - ' + $scope.skill.name.text },
                question: { lang_code: 'en', text: 'Please select your choices for the Chief Expert position in order of preference:' },
                type: 'weighted',
                numberOfSelections: numberOfSelections,
                anonymousResults: true,
                anonymousVoting: false,
                showingResults: false,
                allowingReVote: true,
                allowingAbstain: false,
                whitelist: true,
                options: options,
                allowedVoters: experts
            };

            // C+1 14:00, see Competitions Rules 6.5.5 Nomination, election, and approval
            poll.expiry.setDate(poll.expiry.getDate() + 1);
            poll.expiry.setHours(14);
            poll.expiry.setMinutes(0);

            var p = Poll.save(poll, function (response) {
                alert.success('The poll has been created. Please ask all Experts to login to the Skill Management app and vote.');
                $state.go('skill', {eventId: $scope.skill.event.id, skillId: $scope.skill.id});
            }, function (response) {
                window.alert('An error has occured: ' + JSON.stringify(response.data));
            });
        }
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
