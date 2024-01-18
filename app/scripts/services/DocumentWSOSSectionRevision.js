(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentWSOSSectionSkillRevision', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/skills/:skillId/wsosRevisions/:id', {
            documentId: '@document.id',
            id: '@id'
        }, {
            query: {
                method: 'GET',
            },
            approve: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/skills/:skillId/wsosRevisions/:id/approve'
            }
        });

    });

})();
