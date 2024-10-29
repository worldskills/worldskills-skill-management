'use strict';

angular.module('skillMgmtApp').controller('AdminEventProgressItemsCtrl', function($scope, $state, $stateParams, $q, alert, ProgressItem) {

    $scope.items = ProgressItem.query({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('AdminEventProgressItemCreateCtrl', function($scope, $state, $stateParams, $q, Event, ProgressItem, ProgressItemStatus) {

    $scope.items = ProgressItem.query({eventId: $stateParams.eventId}, function () {
        $scope.item.sort = $scope.items.progress_items.length + 1;
    });

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.item = new ProgressItem();
    $scope.item.title = {text: '', lang_code: 'en'};
    $scope.item.is_header = false;
    $scope.item.has_status = true;
    ProgressItemStatus.query({eventId: $stateParams.eventId}, function (statuses) {
        $scope.item.statuses = statuses.progress_item_statuses;
        angular.forEach($scope.item.statuses, function (status) {
            status.description = {text: '', lang_code: 'en'};
        });
    });
});

angular.module('skillMgmtApp').controller('AdminEventProgressItemCtrl', function($scope, $state, $stateParams, $translate, alert, Event, ProgressItem) {

    $scope.id = $stateParams.itemId;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.item = ProgressItem.get({eventId: $stateParams.eventId, id: $scope.id}, function () {
        $scope.title = $scope.item.title.text;
    });

    $scope.deleteItem = function() {
        $translate('message_confirm_delete_progress_item').then(function (message) {
            if (confirm(message)) {
                $scope.deleteLoading = true;
                $scope.item.$delete({eventId: $scope.event.id}, function () {
                        $translate('message_progress_item_deleted').then(function (message) {
                            alert.success(message);
                            $state.go('admin_event.progress_items', {eventId: $scope.event.id});
                        });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        });
    };
});

angular.module('skillMgmtApp').controller('AdminEventProgressItemFormCtrl', function($scope, $state, $q, $translate, alert) {

    $scope.save = function() {
        $scope.submitted = true;
        if (!$scope.form.$invalid) {
            $scope.loading = true;
            if ($scope.item.id) {
                $scope.item.$update({eventId: $scope.event.id}, function () {
                    $translate('message_progress_item_updated').then(function (message) {
                        alert.success(message);
                        $state.go('admin_event.progress_items', {eventId: $scope.event.id});
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            } else {
                $scope.item.$save({eventId: $scope.event.id}, function () {
                    $translate('message_progress_item_created').then(function (message) {
                        alert.success(message);
                        $state.go('admin_event.progress_items', {eventId: $scope.event.id});
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        }
    };
});
