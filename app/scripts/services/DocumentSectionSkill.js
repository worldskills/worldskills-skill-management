(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentSectionSkill', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/sections/:id/skills/:skillId', {
            documentId: '@document.id',
            id: '@id',
            skillId: '@skill.id'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            }
        });

    });

})();
