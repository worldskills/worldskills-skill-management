'use strict';

angular
  .module('skillMgmtApp', [
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    'worldskills.utils'
  ])
  .config(['$translateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($translateProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

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
    suffix: '.json'
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
    })
    .state('sorry', {
      url: '/sorry',
      templateUrl: 'views/sorry.html'
    })
    .state('form_submission', {
        url: '/events/{eventId}/skills/{skillId}/forms/{formId}',
        templateUrl: 'views/form_submission.html',
        controller: 'FormSubmissionCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('form_submission_list', {
        url: '/events/{eventId}/skills/{skillId}/forms',
        templateUrl: 'views/form_submission_list.html',
        controller: 'FormSubmissionListCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('admin_form', {
        url: '/admin/forms',
        templateUrl: 'views/admin_form.html',
        controller: 'AdminFormCtrl',
        abstract: true
    })
    .state('admin_form.list', {
        url: '?page',
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
    }).state('admin_form.detail', {
        url: '/{id}',
        templateUrl: 'views/admin_form_detail.html',
        controller: 'AdminFormDetailCtrl',
        abstract: true
    }).state('admin_form.detail.submissions', {
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
    }).state('admin_submission', {
        url: '/admin/forms/{formId}/skills/{skillId}/submission',
        templateUrl: 'views/admin_submission.html',
        controller: 'AdminSubmissionCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    }).state('admin_form_progress', {
        url: '/admin/forms_progress',
        templateUrl: 'views/admin_form_progress.html',
        controller: 'AdminFormProgressCtrl',
        data: {
            requireLoggedIn: true,
            requiredRoles: [
                {code: 1200, role: 'Admin'},
                {code: 1200, role: 'ViewAllSubmissions'}
            ]
        }
    });



}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
