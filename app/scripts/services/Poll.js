(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Poll', function ($resource, WORLDSKILLS_API_URL) {

        return $resource(WORLDSKILLS_API_URL + '/votes/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
        });

    });

})();
