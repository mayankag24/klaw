'use strict'

// confirmation of delete
// edit 
// solution for transaction
// message store / key / gui
//var app = angular.module('dashboardApp',['chart.js','ngCookies']);
var app = angular.module('dashboardApp',['chart.js']);

// add $cookies
app.controller("dashboardCtrl", function($scope, $http, $location, $window,  $rootScope) {

	// Set http service defaults
	// We force the "Accept" header to be only "application/json"
	// otherwise we risk the Accept header being set by default to:
	// "application/json; text/plain" and this can result in us
	// getting a "text/plain" response which is not able to be
	// parsed.
	$http.defaults.headers.common['Accept'] = 'application/json';
	$scope.showServerStatus = "false";

        $scope.getChartOverviewChart = function() {

                    $http({
                        method: "GET",
                        url: "getActivityLogForTeamOverview",
                        headers : { 'Content-Type' : 'application/json' },
                        params: {'activityLogForTeam' : 'true' },
                    }).success(function(output) {
                        $scope.activitylogchart = output.activityLogOverview;
                        $scope.topicsperteamchart = output.topicsPerTeamPerEnvOverview;
                    }).error(
                        function(error)
                        {
                            $scope.alert = error;
                        }
                    );
                };

        $scope.getEnvs = function() {

            $http({
                method: "GET",
                url: "getEnvsStatus",
                headers : { 'Content-Type' : 'application/json' }
            }).success(function(output) {
                $scope.allenvs = output;
                $scope.showProgressBar = "false";
            }).error(
                function(error)
                {
                    $scope.alert = error;
                }
            );
        };


        $scope.onShowServerStatus = function(){
            $scope.showServerStatus = "true";
            $scope.showProgressBar = "true";
        }

          $scope.onClickRefresh = function(){
                $scope.showServerStatus = "false";
                $scope.showProgressBar = "false";
          }

          $scope.refreshPage = function(){
                  $window.location.reload();
              }

           $scope.getAuth = function() {
           	$http({
                   method: "GET",
                   url: "getAuth",
                   headers : { 'Content-Type' : 'application/json' }
               }).success(function(output) {
                   $scope.dashboardDetails = output;
                   $scope.userlogged = output.username;
                   $scope.teamname = output.teamname;
                   $scope.tenantName = output.tenantName;
                   $scope.userrole = output.userrole;
                   $scope.myteamtopics = output.myteamtopics;
                   $scope.klawversion = output.klawversion;
                   $scope.notifications = output.notifications;
                   $scope.notificationsAcls = output.notificationsAcls;
                   $scope.notificationsSchemas = output.notificationsSchemas;
                   $scope.notificationsUsers = output.notificationsUsers;
                   $scope.notificationsSchemas = output.notificationsSchemas;

                   if(output.companyinfo == null){
                       $scope.companyinfo = "Company not defined!!";
                   }
                   else
                       $scope.companyinfo = output.companyinfo;

                   if($scope.userlogged != null)
                       $scope.loggedinuser = "true";

                   $scope.teamsize = output.teamsize;
                   $scope.schema_clusters_count = output.schema_clusters_count;
                   $scope.kafka_clusters_count = output.kafka_clusters_count;
                   if(output.kafka_clusters_count == '0')
                        $window.location.href = $window.location.origin + $scope.dashboardDetails.contextPath + "/helpwizard";

                   $scope.checkSwitchTeams($scope.dashboardDetails.canSwitchTeams, $scope.dashboardDetails.teamId, $scope.userlogged);
                   $scope.checkPendingApprovals();
               }).error(
                   function(error)
                   {
                       $scope.alert = error;
                   }
               );
       	}

        $scope.onSwitchTeam = function() {
            var serviceInput = {};
            serviceInput['username'] = $scope.userlogged;
            serviceInput['teamId'] = $scope.teamId;

            swal({
                title: "Are you sure?",
                text: "You would like to update your team ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes !",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: true,
                closeOnCancel: true
            }).then(function(isConfirm) {
                if (isConfirm.value) {
                    $http({
                        method: "POST",
                        url: "user/updateTeam",
                        headers : { 'Content-Type' : 'application/json' },
                        data: serviceInput
                    }).success(function (output) {
                        $scope.alert = "User team update request : "+output.message;
                        if(output.success){
                            swal({
                                title: "",
                                text: "User team update request : "+output.message,
                                timer: 2000,
                                showConfirmButton: true
                            }).then(function(isConfirm){
                                $scope.refreshPage();
                            });
                        }else $scope.showSubmitFailed('','');
                    }).error(
                        function (error) {
                            $scope.handleValidationErrors(error);
                        }
                    );
                } else {
                    $scope.checkSwitchTeams($scope.dashboardDetails.canSwitchTeams, $scope.dashboardDetails.teamId, $scope.userlogged);
                    return;
                }
            });
        }

        $scope.checkSwitchTeams = function(canSwitchTeams, teamId, userId){
            if(canSwitchTeams === 'true'){
                $scope.teamId = parseInt(teamId);
                $scope.getSwitchTeamsList(userId);
            }
        }

        $scope.getSwitchTeamsList = function(userId) {
            $http({
                method: "GET",
                url: "user/" + userId + "/switchTeamsList",
                headers : { 'Content-Type' : 'application/json' }
            }).success(function(output) {
                $scope.switchTeamsListDashboard = output;
            }).error(
                function(error)
                {
                    $scope.alert = error;
                }
            );
        }

       	$scope.redirectToPendingReqs = function(redirectPage){
            swal({
                    title: "Pending Requests",
                    text: "Would you like to look at them ?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, show me!",
                    cancelButtonText: "No, later!",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }).then(function(isConfirm){
                    if (isConfirm.value) {
                        $window.location.href = $window.location.origin + $scope.dashboardDetails.contextPath + "/"+redirectPage;
                    } else {
                        return;
                    }
                });
        }

        $scope.checkPendingApprovals = function() {

            if($scope.dashboardDetails.pendingApprovalsRedirectionPage === '')
                return;
            
            if(sessionStorage.getItem("pending_reqs_shown") === null){
                $scope.redirectToPendingReqs($scope.dashboardDetails.pendingApprovalsRedirectionPage);
                sessionStorage.setItem("pending_reqs_shown", "true");
            }
        }

       	$scope.getDashboardStatistics = function() {
                   	$http({
                           method: "GET",
                           url: "getDashboardStats",
                           headers : { 'Content-Type' : 'application/json' }
                       }).success(function(output) {
                           $scope.producerCount = output.producerCount;
                           $scope.consumerCount = output.consumerCount;
                           $scope.teamMembersCount = output.teamMembersCount;
                       }).error(
                           function(error)
                           {
                               $scope.alert = error;
                           }
                       );
               	}


        $scope.logout = function() {
            $http({
                method: "POST",
                url: "logout",
                headers : { 'Content-Type' : 'application/json' }
            }).success(function(output) {
                $window.location.href = $window.location.origin + $scope.dashboardDetails.contextPath + "/" + "login";
            }).error(
                function(error)
                {
                    $window.location.href = $window.location.origin + $scope.dashboardDetails.contextPath + "/" + "login";
                }
            );
        }

        $scope.sendMessageToAdmin = function(){

                if(!$scope.contactFormSubject)
                    return;
                if(!$scope.contactFormMessage)
                    return;
                if($scope.contactFormSubject.trim().length==0)
                    return;
                if($scope.contactFormMessage.trim().length==0)
                    return;

                $http({
                        method: "POST",
                        url: "sendMessageToAdmin",
                        headers : { 'Content-Type' : 'application/json' },
                        params: {'contactFormSubject' : $scope.contactFormSubject,'contactFormMessage' : $scope.contactFormMessage },
                        data:  {'contactFormSubject' : $scope.contactFormSubject,'contactFormMessage' : $scope.contactFormMessage }
                    }).success(function(output) {
                        $scope.alert = "Message sent to Administrator !!";
                        swal({
                        	 title: "",
                        	 text: "Message sent to Administrator !!",
                        	 timer: 1500,
                        	 showConfirmButton: false
                         });
                    }).error(
                        function(error)
                        {
                            $scope.alert = error;
                        }
                    );
            }

}
);