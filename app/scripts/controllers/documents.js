'use strict';

angular.module('skillMgmtApp').controller('DocumentCtrl', function ($scope, $stateParams, $uibModal, $timeout, $http, WORLDSKILLS_API_SKILLMAN, $anchorScroll, WORLDSKILLS_API_SKILLMAN_CODE, auth, Event, Skill, DocumentSkill, DocumentChapterSkill, Downloader) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillDocument'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillDocument = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ApproveDocument'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanApproveDocument = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'AddSkillDocumentWSOS'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanAddSkillDocumentWSOS = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'DeleteSkillDocumentWSOS'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanDeleteSkillDocumentWSOS = true;
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

            var maxWsosSort = 1;
            $scope.chapter.sections.forEach(function (section) {
                // check if WSOS and count total importance
                if (section.wsos) {
                    $scope.calculateTotalImportance(section);
                    section.wsosSections.forEach(function (wsos) {
                        maxWsosSort = Math.max(maxWsosSort, wsos.sort);
                    });
                }
            });

            $scope.maxWsosSort = maxWsosSort;

            $timeout(function () {
                $anchorScroll();
            });
        });
    }

    $scope.calculateTotalImportance = function (section) {
        section.totalImportance = 0;
        section.wsosSections.forEach(function (wsos) {
            auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillDocument'], $scope.skill.entity_id).then(function (hasUserRole) {
                if (hasUserRole) {
                    section.totalImportance += wsos.latest_revision.importance;
                } else {
                    section.totalImportance += wsos.importance;
                }
            });
        });
    };

    $scope.downloadPDF = function () {
        $scope.loadingPDF = true;

        $http({url: WORLDSKILLS_API_SKILLMAN + '/documents/' + $stateParams.documentId + '/skills/' + $stateParams.skillId + '/pdf', params: {l: 'en'}, method: 'GET', responseType : 'blob'})
            .success( function(data, status, headers) {
                var filename = 'document.pdf';
                Downloader.handleDownload(data, status, headers, filename);
                $scope.loadingPDF = false;
            })
            .error(function(data, status) {
                alert("Error downloading PDF");
                $scope.loadingPDF = false;
            });
    };

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

    $scope.editWsosSection = function (wsosSection, index, wsosIndex) {
        $scope.wsosSection = angular.copy(wsosSection);
        $scope.wsosSectionIndex = index;
        $scope.wsosSectionWsosIndex = wsosIndex;
        $scope.editWsosSectionModal = $uibModal.open({
            templateUrl: 'views/document_wsos_section_edit.html',
            controller: 'DocumentWSOSSectionEditFormCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });
    };

    $scope.addWsosSection = function (index) {

        $scope.wsosSection = {};
        $scope.wsosSection.latest_revision = {};
        $scope.wsosSection.sort = $scope.maxWsosSort + 1;
        $scope.wsosSection.locale = 'en';

        $scope.wsosSectionIndex = index;

        $scope.addWsosSectionModal = $uibModal.open({
            templateUrl: 'views/document_wsos_section_edit.html',
            controller: 'DocumentWSOSSectionEditFormCtrl',
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

    $scope.diffWsosRevision = function (section, wsosSection, index, wsosIndex) {
        $scope.section = section;
        $scope.wsosSection = wsosSection;
        $scope.wsosSectionIndex = index;
        $scope.wsosSectionWsosIndex = wsosIndex;
        $scope.diffWsosRevisionModal = $uibModal.open({
            templateUrl: 'views/document_wsos_section_diff.html',
            controller: 'DocumentWSOSSectionDiffCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });
    }
});

angular.module('skillMgmtApp').controller('DocumentRevisionsCtrl', function ($scope, $stateParams, $uibModal, $filter, Event, Skill, DocumentSkill, DocumentSectionRevision, DocumentSectionSkillRevision, DocumentWSOSSectionSkillRevision) {

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

    DocumentWSOSSectionSkillRevision.query({documentId: $stateParams.documentId, skillId: $stateParams.skillId}, function (revisions) {
        angular.forEach(revisions.revisions, function (revision) {
            revision.wsos = true;
            $scope.revisions.push(revision);
        });
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

    $scope.diffWsosRevision = function (revision) {
        $scope.revision = revision;
        $scope.diffWsosRevisionModal = $uibModal.open({
            templateUrl: 'views/document_wsos_revision_diff.html',
            controller: 'DocumentWSOSRevisionDiffCtrl',
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

angular.module('skillMgmtApp').controller('DocumentWSOSSectionEditFormCtrl', function ($scope, $state, $stateParams, $uibModalInstance, $translate, alert, DocumentWSOSSection) {

    $scope.save = function () {
        $scope.wsosSection.title = $scope.wsosSection.latest_revision.title;
        $scope.wsosSection.knowledge = $scope.wsosSection.latest_revision.knowledge;
        $scope.wsosSection.ability = $scope.wsosSection.latest_revision.ability;
        $scope.wsosSection.importance = $scope.wsosSection.latest_revision.importance;

        if ($scope.wsosSection.id) {
            DocumentWSOSSection.update({documentId: $stateParams.documentId, skillId: $stateParams.skillId, id: $scope.wsosSection.id}, $scope.wsosSection, function (response) {
                $scope.chapter.sections[$scope.wsosSectionIndex].wsosSections[$scope.wsosSectionWsosIndex] = response;
                $scope.calculateTotalImportance($scope.chapter.sections[$scope.wsosSectionIndex]);
                $uibModalInstance.close();
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            });
        } else {
            DocumentWSOSSection.save({documentId: $stateParams.documentId, skillId: $stateParams.skillId}, $scope.wsosSection, function (response) {
                $scope.chapter.sections[$scope.wsosSectionIndex].wsosSections.push(response);
                $scope.calculateTotalImportance($scope.chapter.sections[$scope.wsosSectionIndex]);
                $uibModalInstance.close();
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            });
        }
    };

    $scope.delete = function () {
        $translate('message_confirm_delete_wsos_section').then(function (message) {
            if (window.confirm(message)) {

                DocumentWSOSSection.delete({documentId: $stateParams.documentId, skillId: $stateParams.skillId, id: $scope.wsosSection.id}, function () {
                    $translate('message_wsos_section_deleted').then(function (message) {
                        alert.success(message);
                        $state.reload();
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

angular.module('skillMgmtApp').controller('DocumentSectionDiffCtrl', function ($scope, $stateParams, $sce, $uibModalInstance, htmldiff, DocumentSectionSkillRevision, DocumentSectionSkill) {

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

    $scope.revert = function () {
        DocumentSectionSkill.update({documentId: $stateParams.documentId, id: $scope.section.id, skillId: $stateParams.skillId}, $scope.section.text, function (response) {
            $scope.chapter.sections[$scope.sectionIndex] = response;
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

angular.module('skillMgmtApp').controller('DocumentWSOSSectionDiffCtrl', function ($scope, $stateParams, $sce, $uibModalInstance, htmldiff, DocumentWSOSSectionSkillRevision, DocumentWSOSSection) {

    $scope.diffImportance = $sce.trustAsHtml(htmldiff($scope.wsosSection.importance + '', $scope.wsosSection.latest_revision.importance + ''));
    $scope.diffTitle = $sce.trustAsHtml(htmldiff($scope.wsosSection.title, $scope.wsosSection.latest_revision.title));
    $scope.diffKnowledge = $sce.trustAsHtml(htmldiff($scope.wsosSection.knowledge, $scope.wsosSection.latest_revision.knowledge));
    $scope.diffAbility = $sce.trustAsHtml(htmldiff($scope.wsosSection.ability, $scope.wsosSection.latest_revision.ability));

    $scope.approve = function () {
        DocumentWSOSSectionSkillRevision.approve({documentId: $stateParams.documentId, skillId: $stateParams.skillId, id: $scope.wsosSection.latest_revision.id}, {}, function (section) {
            $scope.chapter.sections[$scope.wsosSectionIndex].wsosSections[$scope.wsosSectionWsosIndex] = section;
            $scope.document.last_updated = $scope.wsosSection.latest_revision.created;
            $uibModalInstance.close();
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };

    $scope.revert = function () {
        DocumentWSOSSection.update({documentId: $stateParams.documentId, skillId: $stateParams.skillId, id: $scope.wsosSection.id}, $scope.wsosSection, function (response) {
            $scope.chapter.sections[$scope.wsosSectionIndex].wsosSections[$scope.wsosSectionWsosIndex] = response;
            $scope.document.last_updated = $scope.wsosSection.latest_revision.created;
            $scope.calculateTotalImportance($scope.chapter.sections[$scope.wsosSectionIndex]);
            $uibModalInstance.close();
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };

    $scope.edit = function () {
        $uibModalInstance.dismiss('edit');
        $scope.editWsosSection($scope.wsosSection, $scope.wsosSectionIndex, $scope.wsosSectionWsosIndex);
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

angular.module('skillMgmtApp').controller('DocumentWSOSRevisionDiffCtrl', function ($scope, $stateParams, $sce, $uibModalInstance, htmldiff) {

    var previousTitle = $scope.revision.previous ? $scope.revision.previous.title : '';
    var previousKnowledge = $scope.revision.previous ? $scope.revision.previous.knowledge : '';
    var previousAbility = $scope.revision.previous ? $scope.revision.previous.ability : '';
    var previousImportance = $scope.revision.previous ? $scope.revision.previous.importance : '';

    $scope.diffTitle = $sce.trustAsHtml(htmldiff(previousTitle, $scope.revision.title));
    $scope.diffKnowledge = $sce.trustAsHtml(htmldiff(previousKnowledge, $scope.revision.knowledge));
    $scope.diffAbility = $sce.trustAsHtml(htmldiff(previousAbility, $scope.revision.ability));
    $scope.diffImportance = $sce.trustAsHtml(htmldiff(previousImportance + '', $scope.revision.importance + ''));

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };

});
