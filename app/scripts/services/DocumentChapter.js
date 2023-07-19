(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentChapter', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/chapters/:id', {
            documentId: '@document.id',
            id: '@id'
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
