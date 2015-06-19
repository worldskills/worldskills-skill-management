(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmission', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/submissions/:id', {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submissions',
            },
            update: {
                method: 'PUT'
            }
        });

    });

})();
