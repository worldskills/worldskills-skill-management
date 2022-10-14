'use strict';

angular.module('skillMgmtApp').controller('SkillCtrl', function($scope, $stateParams, $q, WorldSkills, WORLDSKILLS_API_SKILLMAN_CODE, WORLDSKILLS_API_IL_CODE, WORLDSKILLS_WEB_PROTOCOL, WORLDSKILLS_WEB_DOMAIN, auth, Event, Skill, SkillExpert, Registration, SkillProgressItem, Poll, Resource) {

    $scope.WorldSkills = WorldSkills;
    $scope.WORLDSKILLS_WEB_PROTOCOL = WORLDSKILLS_WEB_PROTOCOL;
    $scope.WORLDSKILLS_WEB_DOMAIN = WORLDSKILLS_WEB_DOMAIN;

    var DOCUMENT_TYPE_TECHNICAL_DESCRIPTION = 4;
    var DOCUMENT_TYPE_HALL_LAYOUTS = 6;
    var DOCUMENT_TYPE_TEST_PROJECT = 7;
    var DOCUMENT_TYPE_HEALTH_SAFETY_ENVIRONMENT = 20;
    var DOCUMENT_TYPE_STANDARD_SPECIFICATION = 19;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {});

    $q.all([$scope.event.$promise, $scope.skill.$promise]).then(function() {

        var tags = [];
        tags.push($scope.event.code ? $scope.event.code : $scope.event.name);
        tags.push('Skill ' + $scope.skill.number);

        $scope.progressItemsReportTotal = 0;

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewManagementPlan'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewManagementPlan = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_IL_CODE, ['Admin', 'View'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewInfrastructureList = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewSubmissionsExperts'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewSubmissionsExperts = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillItems = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSubmissions'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSubmissions = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditLunch'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditLunch = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditExperts'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditExperts = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewProgressItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewProgressItems = true;
        
                $scope.progressItems = SkillProgressItem.query({skillId: $stateParams.skillId});
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewProgressItemsReport'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewProgressItemsReport = true;

                $scope.progressItemsReport = SkillProgressItem.report({skillId: $stateParams.skillId}, function () {

                    angular.forEach($scope.progressItemsReport.reports, function (report) {
                        $scope.progressItemsReportTotal += report.total;
                    });
                });
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditSkillProgressItems'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditSkillProgressItems = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ViewTimetable'], $scope.skill.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanViewTimetable = true;
            }
        });


        $scope.polls = Poll.query({entity: $scope.skill.entity_id});

        $scope.technicalDescription = Resource.query({type: DOCUMENT_TYPE_TECHNICAL_DESCRIPTION, tags: tags, limit: 1});
        $scope.workshopLayouts = Resource.query({type: DOCUMENT_TYPE_HALL_LAYOUTS, tags: tags, limit: 1});
        $scope.testProject = Resource.query({type: DOCUMENT_TYPE_TEST_PROJECT, tags: tags, limit: 10});
        $scope.healthSafetyEnvironment = Resource.query({type: DOCUMENT_TYPE_HEALTH_SAFETY_ENVIRONMENT, tags: tags, limit: 1});
        $scope.occupationalStandard = Resource.query({type: DOCUMENT_TYPE_STANDARD_SPECIFICATION, tags: tags, limit: 1});

        $scope.experts = SkillExpert.query({skillId: $stateParams.skillId});
        $scope.competitors = Registration.competitors({skillId: $stateParams.skillId});

    });

});
