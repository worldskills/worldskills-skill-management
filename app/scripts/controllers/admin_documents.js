'use strict';

angular.module('skillMgmtApp').controller('AdminEventDocumentsCtrl', function($scope, $state, $stateParams, $q, alert, Document) {

    $scope.documents = Document.query({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('AdminDocumentCtrl', function($scope, $state, $stateParams, alert, Event, Document, DocumentChapter) {

    $scope.loading = true;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.document = Document.get({id: $stateParams.documentId}, function () {
        $scope.title = $scope.document.name.text;

        // loop chapters and fetch details
        angular.forEach($scope.document.chapters, function (chapter) {
            chapter.chapter = DocumentChapter.get({documentId: $scope.document.id, id: chapter.id});
        });

        $scope.loading = false;
    });

});

angular.module('skillMgmtApp').controller('AdminDocumentNameCtrl', function($scope, $state, $stateParams, alert, Event, Document, DocumentChapter) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.document = Document.get({id: $stateParams.documentId}, function () {
        $scope.title = $scope.document.name.text;
    });

});
