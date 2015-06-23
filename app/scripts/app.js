'use strict';

angular
  .module('skillMgmtApp', [
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.select2',
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
            $state.go('form_submission_list');
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
    .state('form_submission', {
        url: '/forms/{formId}/skills/{skillId}',
        templateUrl: 'views/form_submission.html',
        controller: 'FormSubmissionCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('form_submission_list', {
        url: '/forms',
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
                {code: 1200, role: 'EditForms'}
            ]
        },
        reloadOnSearch: false
    }).state('admin_form.detail', {
        url: '/{id}',
        templateUrl: 'views/admin_form_detail.html',
        controller: 'AdminFormDetailCtrl',
        abstract: true
    }).state('admin_form.detail.form', {
        url: '',
        templateUrl: 'views/admin_form_detail_form.html',
        controller: 'AdminFormDetailFormCtrl',
        data: {
            requireLoggedIn: true
        }
    });



}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams){
  //DEVELOPMENT API URL
  $rootScope.api_url = "http://localhost:8080/glossary/";
  $rootScope.available_languages = {"en_US":"English", "pt_BR":"Portuguese (Brazil)"};

  //PRODUCTION API URL
  //$rootScope.api_url = "http://beuk.worldskills.org/glossary/";

  // It's very handy to add references to $state and $stateParams to the $rootScope
  // so that you can access them from any scope within your applications.For example,
  // <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
  // to active whenever 'contacts.list' or one of its decendents is active.
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);
