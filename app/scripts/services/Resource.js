(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Resource', function ($resource, WORLDSKILLS_API_URL) {

        return $resource(WORLDSKILLS_API_URL + '/resources/', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
        });

    });

})();
