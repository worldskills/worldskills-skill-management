'use strict';

angular.module('skillMgmtApp').controller('EventsCtrl', function($scope, $stateParams, Event) {

    $scope.loading = true;

    $scope.events = Event.query({type: 'competition'}, function () {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('EventCtrl', function($scope, $stateParams, WORLDSKILLS_API_SKILLMAN_CODE, auth, WorldSkills, Event, Resource) {

    var DOCUMENT_TYPE_CENTRE_RESOURCE = 15;

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditForms', $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditForms = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'ViewAllSubmissions', $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewAllSubmissions = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewProgressItemsInternalNotes'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewProgressItemsInternalNotes = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewDocument'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewDocument = true;
            }
        });

        var tags = [];
        tags.push($scope.event.code ? $scope.event.code : $scope.event.name);

        $scope.resources = Resource.query({type: DOCUMENT_TYPE_CENTRE_RESOURCE, tags: tags, limit: 99}, function () {
            angular.forEach($scope.resources.resources, function (resource) {
                resource.title = resource.name.text;
                resource.link = WorldSkills.getLink(resource.links, 'web_download');
                angular.forEach(resource.metadata, function (metadata) {
                  if (metadata.metadata.name.text == 'Centre Description') {
                    resource.title = metadata.value;
                  }
                });
                angular.forEach(resource.versions, function (version) {
                    angular.forEach(version.translations, function (translation) {
                        resource.storage_type = translation.storage_type.code;
                        angular.forEach(translation.storage_data, function (data) {
                            if (resource.storage_type == 'REDIRECT_LINK' && data.name == 'URL') {
                              resource.link = data.value;
                            }
                        });
                    });
                });
            });
        });
    });

});

angular.module('skillMgmtApp').controller('EventSkillsCtrl', function($scope, $stateParams, Skill, Document) {

    $scope.skills = Skill.query({event: $stateParams.eventId});

    $scope.documents = Document.query({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('EventDocumentCtrl', function ($scope, $stateParams, Event, Skill, Document) {

    $scope.event = Event.get({id: $stateParams.eventId});
    $scope.skills = Skill.query({event: $stateParams.eventId});

    $scope.document = Document.get({id: $stateParams.documentId});

});
