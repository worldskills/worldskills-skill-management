(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmissionFieldPerson', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/submissions/:submissionId/fields/:fieldId/person/:personId', null, {
            update: {
                method: 'PUT'
            }
        });

    });

})();
