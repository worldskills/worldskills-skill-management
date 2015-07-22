(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmissionField', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission/fields/:fieldId', {
            fieldId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });

    });

})();
