(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentWSOSSection', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/skills/:skillId/wsosSections/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            },
            unapprovedSections: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/:id/skills/:skillId/wsosSections/unapproved',
            }
        });

    });

})();
