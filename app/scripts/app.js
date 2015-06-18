'use strict';

angular
  .module('skillMgmtApp', [
    'ngCookies',
    'restangular',
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    'worldskills.utils'
  ])
  .config(['$translateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($translateProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

$urlRouterProvider.otherwise('/');

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
      	templateUrl: 'views/binder_form_list.html',
  	  	controller: 'BinderFormListCtrl'
    })
    .state('binder_form', {
    	url: '/forms/{id}',
    	templateUrl: 'views/binder_form.html',
    	controller: 'BinderFormCtrl'
    })
    .state('binder_form_list', {
    	url: '/forms',
    	templateUrl: 'views/binder_form_list.html',
    	controller: 'BinderFormListCtrl'
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
