(function() {
    'use strict';

    angular.module('skillMgmtApp').service('PersonMember', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/people/:personId/members', {
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
