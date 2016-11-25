(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchAllocation', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations', {
            competitionDayId: '@competition_day_id',
            lunchPeriodId: '@lunch_period.id',
            registrationId: '@registration.id',
            l: 'en'
        }, {
            query: {
                method: 'GET'
            },
            add: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:competitionDayId/:lunchPeriodId/registrations/:registrationId',
            },
            remove: {
                method: 'DELETE',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:competitionDayId/:lunchPeriodId/registrations/:registrationId',
            }
        });

    });

})();
