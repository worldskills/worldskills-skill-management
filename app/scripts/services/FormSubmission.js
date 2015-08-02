(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmission', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission', {
            formId: '@form.id',
            skillId: '@skill.id'
        }, {
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/submissions',
            },
            reject: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission/reject',
            }
        });

    });

})();
