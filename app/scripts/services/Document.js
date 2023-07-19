(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Document', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/documents/events/:eventId',
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
