(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentSectionSkillRevision', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/revisions/:id', {
            documentId: '@document.id',
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            approve: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/revisions/:id/approve'
            }
        });

    });

})();
