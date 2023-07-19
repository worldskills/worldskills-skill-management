(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentChapterSkill', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/chapters/:id/skills/:skillId', {
            documentId: '@document.id',
            id: '@id',
            skillId: '@skill.id'
        }, {
            query: {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });

    });

})();
