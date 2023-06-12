'use strict';

angular.module('skillMgmtApp').controller('DocumentCtrl', function ($scope, $stateParams, $uibModal, WORLDSKILLS_API_SKILLMAN_CODE, auth, Event, Skill, DocumentSkill, DocumentChapterSkill, DocumentSectionSkillRevision) {

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
        $scope.chapter = DocumentChapterSkill.get({documentId: $stateParams.documentId, id: $stateParams.chapterId, skillId: $stateParams.skillId, l: 'en'}, {});

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

    $scope.approveRevision = function (revision, index) {
        DocumentSectionSkillRevision.approve({documentId: $stateParams.documentId, id: revision.id}, {}, function (section) {
            $scope.chapter.sections[index] = section;
            $scope.document.last_updated = revision.created;
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
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
