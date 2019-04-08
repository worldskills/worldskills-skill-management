(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmission', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/submissions/:id', {
            id: '@id',
            formId: '@form.id',
            skillId: '@skill.id',
            l: 'en'
        }, {
            save: {
                method: 'POST',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission'
            },
            update: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission'
            },
            query: {
                method: 'GET'
            },
            reject: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/submissions/:id/reject',
            }
        });

    });

})();
