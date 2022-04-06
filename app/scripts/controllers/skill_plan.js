'use strict';

angular.module('skillMgmtApp').controller('SkillPlanCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $filter, $uibModal, auth, alert, Skill, CompetitionDay, SkillItem, SkillTime) {

    $scope.loading = true;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        $scope.skillItems = SkillItem.query({skillId: $stateParams.skillId}, {}, function () {

            $scope.loading = false;

            angular.forEach($scope.skillItems.items, function (item) {
                if (item.time) {
                    item.time = item.time.substring(0, 5);
                }
            });
        });

        $scope.skillTimes = SkillTime.query({skillId: $stateParams.skillId}, function () {

            angular.forEach($scope.skillTimes.times, function (time) {
                if (time.time) {
                    time.time = time.time.substring(0, 5);
                }
            });

            // create competition day times
            angular.forEach($scope.competitionDays.days, function (day) {
                if (day.competitor_finish_time) {
                    var matches = $filter('filter')($scope.skillTimes.times, {competition_day_id: day.id, type: 'finish'});
                    if (matches.length == 0) {
                        var competitionTime = {
                            competition_day_id: day.id,
                            type: 'finish'
                        };
                        $scope.skillTimes.times.push(competitionTime);
                    }
                }
            });
        });
    });

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {
        $scope.active.skill = $scope.skill;
    });

    $scope.cancelSkillsModal = function () {
        $scope.skillsModal.dismiss('cancel');
    };

    $scope.changeSkill = function () {
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/skill_plan_skills.html',
            size: 'sm',
            scope: $scope
        });
    };
});

angular.module('skillMgmtApp').controller('SkillPlanDayCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, $timeout, auth, alert, SkillItem, SkillTime) {

    $scope.competitionDays.$promise.then(function () {
        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });
    });

    $scope.saving = false;
    $scope.changed = false;
    var saved = function () {
        $scope.saving = false;
        $scope.saved = true;
        $scope.changed = false;
    };

    var errored = function (httpResponse) {
        if (httpResponse.status == 401) {
            // Unauthorized

            window.alert('Your session has timed out. The page will now refresh and you might need to login again.');

            // reload page
            window.location.reload(false)

        } else {
            if (httpResponse.data.user_msg) {
                window.alert('Error: ' + httpResponse.data.user_msg);
            } else {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            }
        }
        $scope.saving = false;
    };

    $scope.itemChanged = function (form, item, time) {
        if (time && item.time) {
            item.time = item.time.replace('.', ':');
            if (item.time.length === 4 && item.time.charAt(1) === ':') {
                item.time = '0' + item.time;
            }
            if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(item.time)) {
                form.time.$setValidity('time', true);
            } else {
                form.time.$setValidity('time', false);
            }
        }
        if (!time || !form.time.$invalid) {
            $scope.changed = true;
            var updateItem = function () {
                $scope.saving = true;
                if (!item.time || form.time.$invalid) {
                    item.time = null;
                }
                if (item.id) {
                    SkillItem.update({skillId: $stateParams.skillId}, item, saved, errored);
                } else {
                    SkillItem.save({skillId: $stateParams.skillId}, item, function (response) {
                        item.id = response.id;
                        saved();
                    }, errored);
                }
            };
            if (item.$timeout) {
                $timeout.cancel(item.$timeout);
            }
            item.$timeout = $timeout(updateItem, 1000);
        }
    };

    $scope.addItem = function () {
        var maxOrderNum = 0;
        $scope.filteredItems.forEach(function (item) {
            maxOrderNum = Math.max(maxOrderNum, item.order_num);
        });
        var newItem = {
            competition_day_id: $scope.active.day.id,
            order_num: maxOrderNum + 1,
            description: {
                lang_code: 'en',
                text: ''
            },
            responsibility: '',
            internal_notes: '',
            skill: $scope.skill
        };
        var lastIndex = $scope.skillItems.items.indexOf($scope.filteredItems[$scope.filteredItems.length - 1]);
        $scope.skillItems.items.splice(lastIndex + 1, 0, newItem);
    };

    $scope.removeItem = function (item) {
        var index = $scope.skillItems.items.indexOf(item);
        $scope.skillItems.items.splice(index, 1);
        SkillItem.delete({skillId: $stateParams.skillId}, item);
    };

    $scope.moveItemUp = function (form, orderNum, item) {
        var index = $scope.skillItems.items.indexOf(item);
        var newItem = $scope.skillItems.items[index];
        var oldItem = $scope.skillItems.items[index - 1];
        $scope.skillItems.items[index - 1] = newItem;
        $scope.skillItems.items[index] = oldItem;
        newItem.order_num = orderNum - 1;
        oldItem.order_num = orderNum;
        $scope.itemChanged(form, newItem, false);
        $scope.itemChanged(form, oldItem, false);
    };

    $scope.moveItemDown = function (form, orderNum, item) {
        var index = $scope.skillItems.items.indexOf(item);
        var newItem = $scope.skillItems.items[index];
        var oldItem = $scope.skillItems.items[index + 1];
        $scope.skillItems.items[index + 1] = newItem;
        $scope.skillItems.items[index] = oldItem;
        newItem.order_num = orderNum + 1;
        oldItem.order_num = orderNum;
        $scope.itemChanged(form, newItem, false);
        $scope.itemChanged(form, oldItem, false);
    };

    $scope.skillTimeChanged = function (form, time) {
        if (time.time) {
            time.time = time.time.replace('.', ':');
            if (time.time.length === 4 && time.time.charAt(1) === ':') {
                time.time = '0' + time.time;
            }
            if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time.time)) {
                form.time.$setValidity('time', true);
            } else {
                form.time.$setValidity('time', false);
            }
        }
        if (!form.time.$invalid) {
            $scope.changed = true;
            var updateTime = function () {
                $scope.saving = true;
                if (!time.time) {
                    time.time = null;
                }
                SkillTime.update({skillId: $stateParams.skillId}, time, saved, errored);
            };
            if (time.$timeout) {
                $timeout.cancel(time.$timeout);
            }
            time.$timeout = $timeout(updateTime, 1000);
        }
    };
    
    $scope.editNote = function (item) {
        var internalNotes = window.prompt('Internal Notes:', item.internal_notes);
        if (internalNotes !== null) {
            item.internal_notes = internalNotes;
            SkillItem.update({skillId: $stateParams.skillId}, item);
        }
    };
});

