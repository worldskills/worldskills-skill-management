(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmissionFieldFile', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission/fields/:fieldId/file/:id', {
            id: '@id'
        }, {
            delete: {
                method: 'DELETE'
            }
        });

    });

})();
