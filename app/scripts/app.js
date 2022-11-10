'use strict';

var skillmanApp = angular
  .module('skillMgmtApp', [
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'pascalprecht.translate',
    'worldskills.utils'
  ]);

skillmanApp.constant('WORLDSKILLS_API_SKILLMAN_CODE', 1200);
skillmanApp.constant('WORLDSKILLS_API_IL_CODE', 2200);
skillmanApp.constant('FILTER_AUTH_ROLES', [1200, 2200]); // Skill Management, IL
skillmanApp.constant('LOAD_CHILD_ENTITY_ROLES', true);

skillmanApp.config(['$translateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($translateProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise(function ($injector, $location) {
        // check for existing redirect
        var $state = $injector.get('$state');
        var redirectToState = sessionStorage.getItem('redirect_to_state');
        var redirectToParams = sessionStorage.getItem('redirect_to_params');
        sessionStorage.removeItem('redirect_to_state');
        sessionStorage.removeItem('redirect_to_params');
        if (redirectToState) {
            if (redirectToParams) {
                redirectToParams = angular.fromJson(redirectToParams);
            } else {
                redirectToParams = {};
            }
            $state.go(redirectToState, redirectToParams);
        } else {
            $state.go('index');
        }
    });

  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json?v=20220331094635'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useLocalStorage();

  //language negotiation
  //http://angular-translate.github.io/docs/#/guide/09_language-negotiation
  // $translateProvider.registerAvailableLanguageKeys(['en', 'pt'], {
  //   'en_US': 'en',
  //   'en_UK': 'en',
  //   'pt_BR': 'pt'
  // });

  // try to find out preferred language by yourself
  //$translateProvider.determinePreferredLanguage();

  //routes
  var assessmentCriteriaMenu = {
    templateUrl: 'views/assessmentCriteria.menu.html',
    controller: 'AssessmentcriteriamenuCtrl'
  };

  $stateProvider

  // //index
    .state('index', {
        url: '/',
        controller: 'IndexCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('events', {
        url: '/events',
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('event', {
        url: '/events/{eventId}',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        abstract: true
    })
    .state('event.skills', {
        url: '/skills',
        templateUrl: 'views/event_skills.html',
        controller: 'EventSkillsCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('skill', {
        url: '/events/{eventId}/skills/{skillId}',
        templateUrl: 'views/skill.html',
        controller: 'SkillCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('sorry', {
      url: '/sorry',
      templateUrl: 'views/sorry.html',
      data: {
          requireLoggedIn: true
      }
    })
    .state('form_submission', {
        url: '/events/{eventId}/skills/{skillId}/forms/{formId}',
        templateUrl: 'views/form_submission.html',
        controller: 'FormSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSubmissions'}
            ]
        }
    })
    .state('form_submission_list', {
        url: '/events/{eventId}/skills/{skillId}/forms',
        templateUrl: 'views/form_submission_list.html',
        controller: 'FormSubmissionListCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSubmissions'}
            ]
        }
    })
    .state('form_submission_submissions', {
        url: '/events/{eventId}/skills/{skillId}/forms/{formId}/submissions',
        templateUrl: 'views/form_submission_submissions.html',
        controller: 'FormSubmissionSubmissionsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSubmissions'}
            ]
        }
    })
    .state('form_submission_submissions_submission', {
        url: '/events/{eventId}/skills/{skillId}/forms/{formId}/submissions/{id}',
        templateUrl: 'views/form_submission_submissions_submission.html',
        controller: 'FormSubmissionSubmissionsSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSubmissions'}
            ]
        }
    })
    .state('skill_plan', {
        url: '/events/{eventId}/skills/{skillId}',
        templateUrl: 'views/skill_plan.html',
        controller: 'SkillPlanCtrl',
        abstract: true
    })
    .state('skill_plan.day', {
        url: '/day/{day}',
        templateUrl: 'views/skill_plan_day.html',
        controller: 'SkillPlanDayCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSkillItems'}
            ]
        }
    })
    .state('plan', {
        url: '/plan/{skillId}/day/{day}',
        templateUrl: 'views/plan.html',
        controller: 'PlanCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewManagementPlan'}
            ]
        }
    })
    .state('form_submissions_experts', {
        url: '/events/{eventId}/skills/{skillId}/form_submissions_experts',
        templateUrl: 'views/form_submissions_experts.html',
        controller: 'FormSubmissionsExpertsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'},
                {code: 1200, role: 'ViewSubmissionsExperts'}
            ]
        }
    })
    .state('form_submissions_experts_form', {
        url: '/events/{eventId}/skills/{skillId}/form_submissions_experts/{formId}',
        templateUrl: 'views/form_submissions_experts_form.html',
        controller: 'FormSubmissionsExpertsFormCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'},
                {code: 1200, role: 'ViewSubmissionsExperts'}
            ]
        }
    })
    .state('form_submissions_experts_submission', {
        url: '/events/{eventId}/skills/{skillId}/form_submissions_experts/{formId}/submissions/{id}',
        templateUrl: 'views/form_submissions_experts_submission.html',
        controller: 'FormSubmissionsExpertsSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'},
                {code: 1200, role: 'ViewSubmissionsExperts'}
            ]
        }
    })
    .state('skill_timetable', {
        url: '/events/{eventId}/skills/{skillId}/timetable',
        templateUrl: 'views/skill_timetable.html',
        controller: 'SkillTimetableCtrl',
        abstract: true
    })
    .state('skill_timetable.day', {
        url: '/day/{day}',
        templateUrl: 'views/skill_timetable_day.html',
        controller: 'SkillTimetableDayCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSkillItems'}
            ]
        }
    })
    .state('skill_timetable_view', {
        url: '/events/{eventId}/skills/{skillId}/timetable/view/day/{day}',
        templateUrl: 'views/skill_timetable_view.html',
        controller: 'SkillTimetableViewCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewTimetable'}
            ]
        }
    })
    .state('timetable_index', {
        url: '/timetable/events/{eventId}?skillId',
        controller: 'TimetableIndexCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewTimetable'}
            ]
        }
    })
    .state('timetable', {
        url: '/timetable/events/{eventId}/competitors/{memberRegPositionId}/day/{day}',
        templateUrl: 'views/timetable.html',
        controller: 'TimetableCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewTimetable'}
            ]
        }
    })
    .state('report_lunch_index', {
        url: '/lunch_report/events/{eventId}',
        controller: 'ReportLunchIndexCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewLunchReport'}
            ]
        }
    })
    .state('report_lunch', {
        url: '/lunch_report/events/{eventId}/members/{memberId}/day/{day}',
        templateUrl: 'views/report_lunch.html',
        controller: 'ReportLunchCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewLunchReport'}
            ]
        }
    })
    .state('lunch', {
        url: '/events/{eventId}/skills/{skillId}/lunch',
        templateUrl: 'views/lunch.html',
        controller: 'LunchCtrl',
        abstract: true
    })
    .state('lunch.day', {
        url: '/day/{day}',
        templateUrl: 'views/lunch_day.html',
        controller: 'LunchDayCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditLunch'}
            ]
        }
    })
    .state('lunch_group_list', {
        url: '/events/{eventId}/skills/{skillId}/groups',
        templateUrl: 'views/lunch_group_list.html',
        controller: 'LunchGroupListCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditLunch'}
            ]
        }
    })
    .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    })
    .state('report_progress_items', {
        url: '/events/{eventId}/reports/progress',
        templateUrl: 'views/report_progress_items.html',
        controller: 'ReportProgressItems',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewProgressItemsInternalNotes'}
            ]
        }
    })
    .state('admin_event', {
        url: '/admin/{eventId}',
        templateUrl: 'views/admin_event.html',
        controller: 'AdminEventCtrl',
        abstract: true
    })
    .state('admin_event.skills', {
        url: '',
        templateUrl: 'views/admin_event_skills.html',
        controller: 'AdminEventSkillsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    })
    .state('admin_event.items', {
        url: '/items/{day}',
        templateUrl: 'views/admin_event_items.html',
        controller: 'AdminEventItemsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditCompetitionItems'}
            ]
        }
    })
    .state('admin_event.form_list', {
        url: '/forms',
        templateUrl: 'views/admin_form_list.html',
        controller: 'AdminFormListCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        },
        reloadOnSearch: false
    })
    .state('admin_event.rooms', {
        url: '/rooms',
        templateUrl: 'views/admin_event_rooms.html',
        controller: 'AdminEventRoomsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditRooms'}
            ]
        }
    })
    .state('admin_event.lunch_periods', {
        url: '/lunch',
        templateUrl: 'views/admin_event_lunch_periods.html',
        controller: 'AdminEventLunchPeriodsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditLunchPeriods'}
            ]
        }
    })
    .state('admin_event.competition_days', {
        url: '/competition_days',
        templateUrl: 'views/admin_event_competition_days.html',
        controller: 'AdminEventCompetitionDaysCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditCompetitionDays'}
            ]
        }
    })
    .state('admin_event.advanced', {
        url: '/advanced',
        templateUrl: 'views/admin_event_advanced.html',
        controller: 'AdminEventAdvancedCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'}
            ]
        }
    })
    .state('admin_skill', {
        url: '/admin/{eventId}/skills/{skillId}',
        templateUrl: 'views/admin_skill.html',
        controller: 'AdminSkillCtrl',
        abstract: true
    })
    .state('admin_skill.expert_nominations', {
        url: '/expert_nominations',
        templateUrl: 'views/admin_skill_expert_nominations.html',
        controller: 'AdminSkillExpertNominationsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditExperts'}
            ]
        }
    })
    .state('admin_skill.experts', {
        url: '/experts',
        templateUrl: 'views/admin_skill_experts.html',
        controller: 'AdminSkillExpertsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditExperts'}
            ]
        }
    })
    .state('admin_skill.form_submissions', {
        url: '/forms',
        templateUrl: 'views/admin_skill_form_submissions.html',
        controller: 'AdminSkillFormSubmissionsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'}
            ]
        }
    })
    .state('admin_skill.progress', {
        url: '/progress',
        templateUrl: 'views/admin_skill_progress.html',
        controller: 'AdminSkillProgressCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditSkillProgressItems'}
            ]
        }
    })
    .state('report_lunch_summary', {
        url: '/events/{eventId}/reports/lunch_summary',
        templateUrl: 'views/report_lunch_summary.html',
        controller: 'ReportLunchSummaryCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewLunchReport'}
            ]
        }
    })
    .state('report_lunch_in_workshop', {
        url: '/events/{eventId}/reports/lunch_in_workshop',
        templateUrl: 'views/report_lunch_in_workshop.html',
        controller: 'ReportLunchInWorkshopCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewLunchReport'}
            ]
        }
    })
    .state('report_competitor_finish_times', {
        url: '/events/{eventId}/reports/competitor_finish_times',
        templateUrl: 'views/report_competitor_finish_times.html',
        controller: 'ReportCompetitorFinishCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewManagementPlan'}
            ]
        }
    })
    .state('admin_competitor_names', {
        url: '/admin/{eventId}/competitor_names',
        templateUrl: 'views/admin_event_competitor_names.html',
        controller: 'AdminEventCompetitorNamesCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    })
    .state('admin_competitor_date_of_birth', {
        url: '/admin/{eventId}/competitor_date_of_birth',
        templateUrl: 'views/admin_event_competitor_date_of_birth.html',
        controller: 'AdminEventCompetitorDateOfBirthCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    })
    .state('admin_form_create', {
        url: '/admin/{eventId}/forms/create',
        templateUrl: 'views/admin_form_create.html',
        controller: 'AdminFormCreateCtrl',
        abstract: true
    }).state('admin_form_create.form', {
        url: '',
        templateUrl: 'views/admin_form_detail_form.html',
        controller: 'AdminFormDetailFormCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditForms'}
            ]
        }
    })
    .state('admin_form_detail', {
        url: '/admin/{eventId}/forms/{id}',
        templateUrl: 'views/admin_form_detail.html',
        controller: 'AdminFormDetailCtrl',
        abstract: true
    }).state('admin_form_detail.submissions', {
        url: '',
        templateUrl: 'views/admin_form_detail_submissions.html',
        controller: 'AdminFormDetailSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    }).state('admin_form_detail.form', {
        url: '/form',
        templateUrl: 'views/admin_form_detail_form.html',
        controller: 'AdminFormDetailFormCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditForms'}
            ]
        }
    }).state('admin_form_detail.fields', {
        url: '/fields',
        templateUrl: 'views/admin_form_detail_fields.html',
        controller: 'AdminFormDetailFieldsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditForms'}
            ]
        }
    }).state('admin_form_detail.preview', {
        url: '/preview',
        templateUrl: 'views/admin_form_detail_preview.html',
        controller: 'AdminFormDetailPreviewCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'EditForms'}
            ]
        }
    }).state('admin_submission', {
        url: '/admin/events/{eventId}/forms/{formId}/submissions/{id}',
        templateUrl: 'views/admin_submission.html',
        controller: 'AdminSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    }).state('admin_event.form_progress', {
        url: '/admin/events/{eventId}/forms_progress',
        templateUrl: 'views/admin_form_progress.html',
        controller: 'AdminFormProgressCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    })
    .state('admin_event.progress_items', {
        url: '/admin/events/{eventId}/progress_items',
        templateUrl: 'views/admin_progress_items.html',
        controller: 'AdminEventProgressItemsCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'}
            ]
        }
    })
    .state('admin_progress_item_create', {
        url: '/admin/events/{eventId}/progress_items/create',
        templateUrl: 'views/admin_progress_item.html',
        controller: 'AdminEventProgressItemCreateCtrl',
        abstract: true
    })
    .state('admin_progress_item_create.form', {
        url: '',
        templateUrl: 'views/admin_progress_item_form.html',
        controller: 'AdminEventProgressItemFormCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
            ]
        }
    })
    .state('admin_progress_item', {
        url: '/admin/events/{eventId}/progress_items/{itemId}',
        templateUrl: 'views/admin_progress_item.html',
        controller: 'AdminEventProgressItemCtrl',
        abstract: true
    })
    .state('admin_progress_item.form', {
        url: '',
        templateUrl: 'views/admin_progress_item_form.html',
        controller: 'AdminEventProgressItemFormCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'}
            ]
        }
    });



}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
