(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentSection', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/sections/:id', {
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
            },
            search: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/search'
            },
            replace: {
                method: 'POST',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/replace'
            },
        });

    });

})();
