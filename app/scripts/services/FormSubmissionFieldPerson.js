(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmissionFieldPerson', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission/fields/:fieldId/person/:personId', null, {
            update: {
                method: 'PUT'
            }
        });

    });

})();
