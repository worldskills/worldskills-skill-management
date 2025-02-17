'use strict';

angular.module('skillMgmtApp').controller('SkillTimetableCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $filter, $uibModal, auth, alert, Skill, CompetitionDay, SkillTimetableItem, LunchGroup) {

    $scope.loading = false;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        $scope.skillItems = SkillTimetableItem.query({skillId: $stateParams.skillId}, {}, function () {

        });

    });

    $scope.groups = LunchGroup.query({skillId: $stateParams.skillId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {
        $scope.active.skill = $scope.skill;
    });

    $scope.active.group = null;
    $scope.filterItems = function (item) {
        return item.competition_day_id === $scope.active.day.id &&
            (item.group === null || ($scope.active.group === null || item.group.id === $scope.active.group.id));
    };
    $scope.filterGroups = function (group) {
        if (group) {
            $scope.active.group = group;
        } else {
            $scope.active.group = null;
        }
    };

    $scope.cancelSkillsModal = function () {
        $scope.skillsModal.dismiss('cancel');
    };

    $scope.changeSkill = function () {
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/skill_timetable_skills.html',
            size: 'sm',
            scope: $scope
        });
    };
});

angular.module('skillMgmtApp').controller('SkillTimetableDayCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, $timeout, $uibModal, auth, alert, SkillTimetableItem) {

    $scope.competitionDays.$promise.then(function () {
        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });
    });

    $scope.addItem = function () {
        $scope.item = new SkillTimetableItem();
        $scope.item.competition_day_id = $scope.active.day.id;
        $scope.item.description = {lang_code: 'en', text: ''};
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/skill_timetable_item.html',
            controller: 'SkillTimetableItemCtrl',
            scope: $scope,
            animation: false
        });
    };

    $scope.editItem = function (item) {
        $scope.item = new SkillTimetableItem();
        $scope.item.id = item.id;
        $scope.item.competition_day_id = item.competition_day_id;
        $scope.item.start_time = item.start_time.substring(0, 5);
        $scope.item.end_time = item.end_time.substring(0, 5);
        $scope.item.description = {lang_code: 'en', text: item.description.text};
        $scope.item.group = item.group;
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/skill_timetable_item.html',
            controller: 'SkillTimetableItemCtrl',
            scope: $scope,
            animation: false
        });
    };
});

angular.module('skillMgmtApp').controller('SkillTimetableItemCtrl', function ($scope, $translate, $uibModalInstance, SkillTimetableItem) {

    $scope.submitted = false;

    var errored = function (httpResponse) {
        $scope.loading = false;
        if (httpResponse.status == 401) {
            // Unauthorized

            $translate('message_error_session_timed_out').then(function (message) {
                window.alert(message);

                // reload page
                window.location.reload(false);
            });

        } else {
            if (httpResponse.data.user_msg) {
                window.alert('Error: ' + httpResponse.data.user_msg);
            } else {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            }
        }
        $scope.saving = false;
    };

    $scope.startTimeChanged = function () {
        if ($scope.item.start_time) {
            $scope.item.start_time = $scope.item.start_time.replace('.', ':');
            if ($scope.item.start_time.length === 4 && $scope.item.start_time.charAt(1) === ':') {
                $scope.item.start_time = '0' + $scope.item.start_time;
            }
        }
    };

    $scope.endTimeChanged = function (time) {
        if ($scope.item.end_time) {
            $scope.item.end_time = $scope.item.end_time.replace('.', ':');
            if ($scope.item.end_time.length === 4 && $scope.item.end_time.charAt(1) === ':') {
                $scope.item.end_time = '0' + $scope.item.end_time;
            }
            if ($scope.item.end_time < $scope.item.start_time) {
                $scope.form.endTime.$setValidity('before', false);
            } else {
                $scope.form.endTime.$setValidity('before', true);
            }
        }
    };

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.item.id) {
                SkillTimetableItem.update({skillId: $scope.skill.id}, $scope.item, function (response) {
                    for (var i = $scope.skillItems.items.length - 1; i >= 0; i--){
                        if ($scope.skillItems.items[i].id == $scope.item.id){
                            $scope.skillItems.items.splice(i, 1);
                        }
                    }
                    $scope.skillItems.items.push(response);
                    $scope.loading = false;
                    $uibModalInstance.close();
                }, errored);
            } else {
                SkillTimetableItem.save({skillId: $scope.skill.id}, $scope.item, function (response) {
                    $scope.skillItems.items.push(response);
                    $scope.loading = false;
                    $uibModalInstance.close();
                }, errored);
            }
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        for (var i = $scope.skillItems.items.length - 1; i >= 0; i--){
            if ($scope.skillItems.items[i].id == $scope.item.id){
                $scope.skillItems.items.splice(i, 1);
            }
        }
        SkillTimetableItem.delete({skillId: $scope.skill.id}, $scope.item);
        $uibModalInstance.close();
    };
});

angular.module('skillMgmtApp').controller('SkillTimetableViewCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $filter, $uibModal, WORLDSKILLS_API_SKILLMAN_CODE, auth, alert, Skill, CompetitionDay, SkillTimetableItem, LunchGroup) {

    $scope.loading = true;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        $scope.skillItems = SkillTimetableItem.query({skillId: $stateParams.skillId}, {}, function () {
            $scope.loading = false;
        });

        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });
    });

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {
        $scope.active.skill = $scope.skill;

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillItems = true;
            }
        });
    });

    $scope.changeDay = function (day) {
        $state.go('.', {day: day.timeline}, {location: 'replace', notify: false});
        $scope.active.day = day;
    };

});
