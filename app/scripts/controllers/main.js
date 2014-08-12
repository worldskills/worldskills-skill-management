'use strict';

angular.module('skillMgmtApp')
  .controller('MainCtrl', ['$scope', '$state', '$translate', 'Language', function ($scope, $state, $translate, Language) {
    $scope.selectedLanguage = Language.selectedLanguage;
  }]);
