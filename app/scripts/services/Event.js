(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Event', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
