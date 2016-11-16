(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Form', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/events/:eventId/forms',
            }
        });

    });

})();
