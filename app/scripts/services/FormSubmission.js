(function() {
    'use strict';

    angular.module('skillMgmtApp').service('FormSubmission', function ($resource, $filter, WORLDSKILLS_API_SKILLMAN) {

        function convertResponseDate(data) {
            if (angular.isString(data)) {
                data = angular.fromJson(data);
                angular.forEach(data.fields, function (field) {
                    angular.forEach(field.people, function (person) {
                        person.dob = $filter('date')(person.date_of_birth, 'dd.MM.yyyy');
                    });
                });
            }
            return data;
        }

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/submissions/:id', {
            id: '@id',
            formId: '@form.id',
            skillId: '@skill.id',
            l: 'en'
        }, {
            get: {
                method: 'GET',
                transformResponse: convertResponseDate
            },
            save: {
                method: 'POST',
                url: WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submission',
                transformResponse: convertResponseDate
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
