'use strict';

angular.module('skillMgmtApp').controller('DocumentCtrl', function ($scope, $stateParams, $uibModal, $timeout, $anchorScroll, WORLDSKILLS_API_SKILLMAN_CODE, auth, Event, Skill, DocumentSkill, DocumentChapterSkill, DocumentSectionSkillRevision) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillDocument'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillDocument = true;
            }
        });
    });

    $scope.document = DocumentSkill.get({id: $stateParams.documentId, skillId: $stateParams.skillId}, {}, function () {

        if ($stateParams.chapterId) {
            // loop chapters from document and set next and previous chapter
            angular.forEach($scope.document.chapters, function (chapter, index) {
                if (chapter.id == $stateParams.chapterId) {
                    if (index > 0) {
                        $scope.previousChapter = $scope.document.chapters[index - 1];
                    }
                    if (index < $scope.document.chapters.length - 1) {
                        $scope.nextChapter = $scope.document.chapters[index + 1];
                    }
                }
            });
        }
    });

    if ($stateParams.chapterId) {
        $scope.chapter = DocumentChapterSkill.get({documentId: $stateParams.documentId, id: $stateParams.chapterId, skillId: $stateParams.skillId, l: 'en'}, {}, function () {
            $timeout(function () {
                $anchorScroll();
            });
        });
    }

    $scope.editSection = function (section, index) {
        $scope.section = angular.copy(section);
        $scope.sectionIndex = index;
        $scope.editSectionModal = $uibModal.open({
            templateUrl: 'views/document_section_edit.html',
            controller: 'DocumentSectionEditFormCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });
    };

    // show diff between two revisions in new modal window
    $scope.diffRevision = function (section, index) {
        $scope.section = section;
        $scope.sectionIndex = index;
        $scope.diffRevisionModal = $uibModal.open({
            templateUrl: 'views/document_section_diff.html',
            controller: 'DocumentSectionDiffCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });
    };
});

angular.module('skillMgmtApp').controller('DocumentRevisionsCtrl', function ($scope, $stateParams, $uibModal, $filter, Event, Skill, DocumentSkill, DocumentSectionRevision, DocumentSectionSkillRevision) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skill = Skill.get({id: $stateParams.skillId});

    $scope.document = DocumentSkill.get({id: $stateParams.documentId, skillId: $stateParams.skillId});

    $scope.revisions = [];
    
    DocumentSectionSkillRevision.query({documentId: $stateParams.documentId, skillId: $stateParams.skillId}, function (revisions) {
        angular.forEach(revisions.revisions, function (revision) {
            $scope.revisions.push(revision);
        });
    });

    DocumentSectionRevision.query({documentId: $stateParams.documentId}, function (revisions) {
        angular.forEach(revisions.revisions, function (revision) {
            $scope.revisions.push(revision);
        });
    });

    // sort revisions by revision date created
    $scope.revisions.sort(function (a, b) {
        return $filter('date')(b.created, 'yyyy-MM-ddTHH:mm:ssZ') - $filter('date')(a.created, 'yyyy-MM-ddTHH:mm:ssZ');
    });

    $scope.diffRevision = function (revision) {
        $scope.revision = revision;
        $scope.diffRevisionModal = $uibModal.open({
            templateUrl: 'views/document_revision_diff.html',
            controller: 'DocumentRevisionDiffCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });
    };

});

angular.module('skillMgmtApp').controller('DocumentSectionEditFormCtrl', function ($scope, $stateParams, $uibModalInstance, DocumentSectionSkill) {

    $scope.save = function () {
        var text = {
            text: $scope.section.latest_revision.text,
            lang_code: $scope.section.text.lang_code
        };
        DocumentSectionSkill.update({documentId: $stateParams.documentId, id: $scope.section.id, skillId: $stateParams.skillId}, text, function (response) {
            $scope.chapter.sections[$scope.sectionIndex] = response;
            $uibModalInstance.close();
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

angular.module('skillMgmtApp').controller('DocumentSectionDiffCtrl', function ($scope, $stateParams, $sce, $uibModalInstance, htmldiff, DocumentSectionSkillRevision) {

    $scope.diff = $sce.trustAsHtml(htmldiff($scope.section.text.text, $scope.section.latest_revision.text));

    $scope.approve = function () {
        DocumentSectionSkillRevision.approve({documentId: $stateParams.documentId, id: $scope.section.latest_revision.id}, {}, function (section) {
            $scope.chapter.sections[$scope.sectionIndex] = section;
            $scope.document.last_updated = $scope.section.latest_revision.created;
            $uibModalInstance.close();
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };

    $scope.edit = function () {
        $uibModalInstance.dismiss('edit');
        $scope.editSection($scope.section, $scope.sectionIndex);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

angular.module('skillMgmtApp').controller('DocumentRevisionDiffCtrl', function ($scope, $stateParams, $sce, $uibModalInstance, htmldiff) {

    var previousText = $scope.revision.previous ? $scope.revision.previous.text : '';

    $scope.diff = $sce.trustAsHtml(htmldiff(previousText, $scope.revision.text));

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };

});
