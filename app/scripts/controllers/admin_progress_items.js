'use strict';

angular.module('skillMgmtApp').controller('AdminEventProgressItemsCtrl', function($scope, $state, $stateParams, $q, alert, ProgressItem) {

    $scope.items = ProgressItem.query({eventId: $stateParams.eventId}, function () {

    });

});

angular.module('skillMgmtApp').controller('AdminEventProgressItemCreateCtrl', function($scope, $state, $stateParams, $q, Event, ProgressItem) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.item = new ProgressItem();
    $scope.item.title = {text: '', lang_code: 'en'};
    $scope.item.statuses = [
        {sort: 1, color: '#5db85b', name: {text: 'Green', lang_code: 'en'}, description: {text: '', lang_code: 'en'}},
        {sort: 2, color: '#FDBF02', name: {text: 'Yellow', lang_code: 'en'}, description: {text: '', lang_code: 'en'}},
        {sort: 3, color: '#FE7E03', name: {text: 'Orange', lang_code: 'en'}, description: {text: '', lang_code: 'en'}},
        {sort: 4, color: '#c9312c', name: {text: 'Red', lang_code: 'en'}, description: {text: '', lang_code: 'en'}}
    ];
});

angular.module('skillMgmtApp').controller('AdminEventProgressItemCtrl', function($scope, $state, $stateParams, alert, Event, ProgressItem) {

    $scope.id = $stateParams.itemId;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.item = ProgressItem.get({eventId: $stateParams.eventId, id: $scope.id}, function () {
        $scope.title = $scope.item.title.text;
    });

    $scope.deleteItem = function() {
       if (confirm('Are you sure you want to delete this progress item for all skills? Click OK to proceed.')) {
           $scope.deleteLoading = true;
           $scope.item.$delete(function () {
               alert.success('The progress item has been deleted successfully.');
               $state.go('admin_event.progress_items', {eventId: $scope.event.id});
           });
       }
    };
});

angular.module('skillMgmtApp').controller('AdminEventProgressItemFormCtrl', function($scope, $state, $q, alert) {

    $scope.save = function() {
        $scope.submitted = true;
        if (!$scope.form.$invalid) {
            $scope.loading = true;
            if ($scope.item.id) {
                $scope.item.$update({eventId: $scope.event.id}, function () {
                    alert.success('The progress item has been updated successfully.');
                    $state.go('admin_event.progress_items', {eventId: $scope.event.id});
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            } else {
                $scope.item.$save({eventId: $scope.event.id}, function () {
                    alert.success('The progress item has been added successfully.');
                    $state.go('admin_event.progress_items', {eventId: $scope.event.id});
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        }
    };
});
