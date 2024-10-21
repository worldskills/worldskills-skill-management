'use strict';

angular.module('skillMgmtApp').controller('TranslateCtrl', function ($translate, $scope, $http, $state) {

		// get current language
		$scope.selectedLanguage = $translate.proposedLanguage();

		$scope.changeLanguage = function(langKey){
			$translate.use(langKey);
			$scope.selectedLanguage = langKey;

			// force locale for api requests
			$http.defaults.headers.common["Accept-Language"] = langKey;

			$state.reload();
		};

});
