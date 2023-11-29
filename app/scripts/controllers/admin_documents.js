'use strict';

angular.module('skillMgmtApp').controller('AdminEventDocumentsCtrl', function($scope, $state, $stateParams, Document) {

    $scope.documents = Document.query({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('AdminDocumentCtrl', function($scope, $state, $stateParams, $uibModal, Event, Document, DocumentChapter, DocumentSection) {

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

angular.module('skillMgmtApp').controller('AdminDocumentSkillsCtrl', function($scope, $state, $stateParams, $http, $timeout, $interval, Skill, DocumentSkill, Downloader, WORLDSKILLS_API_SKILLMAN, WORLDSKILLS_API_AUTH) {

    $scope.skills = Skill.query({event: $stateParams.eventId}, function () {

        angular.forEach($scope.skills.skills, function (skill) {
            skill.unapprovedSections = DocumentSkill.unapprovedSections({id: $stateParams.documentId, skillId: skill.id});
        });
    });

    $scope.downloadPDFs = function () {
        $scope.loadingPDF = true;

        var skills = $scope.skills.skills;
        var countdown = skills.length;

        // keep session alive
        var intervalPromise = $interval(function () {
            $http({method: 'GET', url: WORLDSKILLS_API_AUTH + '/ping'});
        }, 2000);

        var doCountdown = function () {
            countdown--;
            if (countdown == 0) {
                $scope.loadingPDF = false;
                $interval.cancel(intervalPromise);
            }
        };

        angular.forEach(skills, function (skill, i) {
            $timeout(function () {
                $http({url: WORLDSKILLS_API_SKILLMAN + '/documents/' + $stateParams.documentId + '/skills/' + skill.id + '/pdf', params: {l: 'en'}, method: 'GET', responseType : 'blob'})
                    .success( function(data, status, headers) {
                        var filename = 'document.pdf';
                        Downloader.handleDownload(data, status, headers, filename);
                        doCountdown();
                    })
                    .error(function(data, status) {
                        alert("Error downloading PDF for Skill " + skill.number + " " + skill.name.text);
                        doCountdown();
                    });
            }, i * 10000);
        });
    };

});

angular.module('skillMgmtApp').controller('AdminDocumentSearchCtrl', function($scope, $state, $stateParams, $timeout, alert, DocumentSection) {

    $scope.query = '';

    $scope.htmlEntities = function (str) {
        return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    };

    var timeoutSearch;
    $scope.searchChanged = function () {
        $scope.loading = true;
        var search = function () {

            $scope.sections = DocumentSection.search({documentId: $stateParams.documentId, query: $scope.query, l: 'en'}, function (response) {

                // highlight query in results
                angular.forEach($scope.sections.sections, function (section) {
                    var text = section.introduction.text;
                    if (section.skill) {
                        text = section.latest_revision.text;
                    }
                    // escape HTML
                    text = $scope.htmlEntities(text);
                    section.highlighted = text.replace(new RegExp($scope.htmlEntities($scope.query), 'g'), '<span class="worldskills-highlight">$&</span>');
                });

                $scope.loading = false;
            });
        };
        if (timeoutSearch) {
            $timeout.cancel(timeoutSearch);
        }
        timeoutSearch = $timeout(search, 1000);
    };

    $scope.replace = function () {
        if (window.confirm('Replace all occurences of "' + $scope.query + '" with "' + $scope.replacement + '"? ' + $scope.sections.sections.length + ' section(s) will be updated. Click OK to proceed.')) {
            $scope.loading = true;
            $scope.sections = DocumentSection.replace({documentId: $stateParams.documentId, query: $scope.query, l: 'en'}, {text: $scope.replacement, lang_code: 'en'}, function (response) {

                // highlight query in results
                angular.forEach($scope.sections.sections, function (section) {
                    var text = section.introduction.text;
                    if (section.skill) {
                        text = section.latest_revision.text;
                    }
                    // escape HTML
                    text = $scope.htmlEntities(text);
                    section.highlighted = text.replace(new RegExp($scope.htmlEntities($scope.replacement), 'g'), '<span class="worldskills-replaced">$&</span>');
                });

                $scope.loading = false;

                alert.success('Text replaced, ' + $scope.sections.sections.length + ' section(s) have been updated.');
            });
        }
    };

});

angular.module('skillMgmtApp').controller('AdminDocumentChaptersCtrl', function($scope, $state, $stateParams, $uibModal, Event, Document, DocumentChapter, DocumentSection) {

    $scope.editSection = function (index, chapter, section) {

        // open modal for editing section
        $scope.section = angular.copy(section);
        $scope.sectionModal = $uibModal.open({
            templateUrl: 'views/admin_document_section.html',
            controller: 'AdminDocumentSectionCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });

        $scope.sectionModal.result.then(function (result) {
            if (result) {
                chapter.sections[index] = result;
            } else {
                chapter.sections.splice(index, 1);
            }
        });
    };

    $scope.addSection = function (chapter) {

        $scope.section = {};
        $scope.section.chapter_id = chapter.id;
        $scope.section.title = {lang_code: 'en', text: ''};
        $scope.section.introduction = {lang_code: 'en', text: ''};
        $scope.section.explanation = {lang_code: 'en', text: ''};
        $scope.section.level = 1;
        $scope.section.sort = chapter.chapter.sections.length + 1;
        $scope.sectionModal = $uibModal.open({
            templateUrl: 'views/admin_document_section.html',
            controller: 'AdminDocumentSectionCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });

        $scope.sectionModal.result.then(function (result) {
            chapter.chapter.sections.push(result);
        });

    };

    $scope.editChapter = function (index, chapter) {

        // open modal for editing chapter
        $scope.chapter = angular.copy(chapter);
        $scope.chapterModal = $uibModal.open({
            templateUrl: 'views/admin_document_chapter.html',
            controller: 'AdminDocumentChapterCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });

        $scope.chapterModal.result.then(function (result) {
            if (result) {
                chapter.chapter = result;
            } else {
                $scope.document.chapters.splice(index, 1);
            }
        });
    };

    $scope.addChapter = function () {
        
        $scope.chapter = {};
        $scope.chapter.chapter = new DocumentChapter();
        $scope.chapter.chapter.title = {lang_code: 'en', text: ''};
        $scope.chapter.chapter.sort = $scope.document.chapters.length + 1;
        $scope.chapterModal = $uibModal.open({
            templateUrl: 'views/admin_document_chapter.html',
            controller: 'AdminDocumentChapterCtrl',
            scope: $scope,
            size: 'lg',
            animation: false
        });

        $scope.chapterModal.result.then(function (result) {
            result.chapter = angular.copy(result);
            $scope.document.chapters.push(result);
        });
    };

    function swapPositionsWithCallback(array, index1, index2, callback) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
        callback(array, index1);
        callback(array, index2);
    };

    function chapterCallback(array, index) {
        array[index].chapter.sort = index + 1;
        DocumentChapter.update({documentId: $scope.document.id}, array[index].chapter, function (response) {
            array[index].chapter = response;
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    }

    $scope.moveChapterUp = function (index, chapter) {
        swapPositionsWithCallback($scope.document.chapters, index, index - 1, chapterCallback);
    };

    $scope.moveChapterDown = function (index, chapter) {
        swapPositionsWithCallback($scope.document.chapters, index, index + 1, chapterCallback);
    };

    function sectionCallback(array, index) {
        array[index].sort = index + 1;
        DocumentSection.update({documentId: $scope.document.id}, array[index], function (response) {
            array[index] = response;
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    }

    $scope.moveSectionUp = function (index, chapter, section) {
        swapPositionsWithCallback(chapter.sections, index, index - 1, sectionCallback);
    };

    $scope.moveSectionDown = function (index, chapter, section) {
        swapPositionsWithCallback(chapter.sections, index, index + 1, sectionCallback);
    };
});

angular.module('skillMgmtApp').controller('AdminDocumentSectionCtrl', function ($scope, $uibModalInstance, alert, DocumentSection) {

    $scope.submitted = false;

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.section.id) {
                DocumentSection.update({documentId: $scope.document.id}, $scope.section, function (response) {
                    alert.success('The subsection has been updated.');
                    $uibModalInstance.close(response);
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            } else {
                DocumentSection.save({documentId: $scope.document.id}, $scope.section, function (response) {
                    alert.success('The subsection has been created.');
                    $uibModalInstance.close(response);
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        if (confirm('Really delete the subsection and all edits from all Skills? Click OK to proceed.')) {
            DocumentSection.delete({documentId: $scope.document.id, id: $scope.section.id}, function () {
                alert.success('The subsection has been deleted.');
                $uibModalInstance.close();
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                $scope.loading = false;
            });
        }
    };
});

angular.module('skillMgmtApp').controller('AdminDocumentChapterCtrl', function ($scope, $uibModalInstance, alert, DocumentChapter) {

    $scope.submitted = false;

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.chapter.id) {
                DocumentChapter.update({documentId: $scope.document.id}, $scope.chapter.chapter, function (response) {
                    alert.success('The section has been updated.');
                    $uibModalInstance.close(response);
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                    $scope.loading = false;
                });
            } else {
                DocumentChapter.save({documentId: $scope.document.id}, $scope.chapter.chapter, function (response) {
                    alert.success('The section has been created.');
                    $uibModalInstance.close(response);
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                    $scope.loading = false;
                });
            }
        }
    };

    $scope.delete = function () {
        if (confirm('Deleting the section will also delete all of its subsections! Click OK to proceed.')) {
            DocumentChapter.delete({documentId: $scope.document.id, id: $scope.chapter.id}, $scope.chapter, function () {
                alert.success('The section has been deleted.');
                $uibModalInstance.close();
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('skillMgmtApp').controller('AdminDocumentNameCtrl', function($scope, $state, $stateParams, alert, Event, Document, DocumentChapter) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.document = Document.get({id: $stateParams.documentId}, function () {
        $scope.title = $scope.document.name.text;
    });

});
