(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormField', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/fields/:fieldId', {
            fieldId: '@id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
            }
        });

    });

})();
