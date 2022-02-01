'use strict'

// confirmation of delete
// edit 
// solution for transaction
// message store / key / gui
var app = angular.module('synchronizeAclsApp',[]);

app.controller("synchronizeAclsCtrl", function($scope, $http, $location, $window) {

    $scope.handleErrorMessage = function(error){
            if(error != null && error.message != null){
                $scope.alert = error.message;
                $scope.alertnote = $scope.alert;
                $scope.showAlertToast();
            }else{
                    $scope.alert = error;
                    $scope.alertnote = error;
                    $scope.showAlertToast();
            }
        }

   	$scope.showSubmitFailed = function(title, text){
		swal({
			 title: "",
			 text: "Request unsuccessful !!",
			 timer: 2000,
			 showConfirmButton: false
			 });
	}

	$scope.showAlertToast = function() {
                 var x = document.getElementById("alertbar");
                 x.className = "show";
                 setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
               }

	$scope.getEnvs = function() {
	        $http({
                method: "GET",
                url: "getSyncEnv",
                headers : { 'Content-Type' : 'application/json' }
            }).success(function(output) {
                $scope.allenvs = output;
            }).error(
                function(error)
                {
                    $scope.alert = error;
                }
            );
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
            $scope.userrole = output.userrole;
             $scope.notifications = output.notifications;
            $scope.notificationsAcls = output.notificationsAcls;
            $scope.notificationsSchemas = output.notificationsSchemas;
            $scope.notificationsUsers = output.notificationsUsers;

            if(output.companyinfo == null){
                $scope.companyinfo = "Company not defined!!";
            }
            else
                $scope.companyinfo = output.companyinfo;

            if($scope.userlogged != null)
                $scope.loggedinuser = "true";

            $scope.checkPendingApprovals();
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
						if (isConfirm.dismiss != "cancel") {
							$window.location.href = $window.location.origin + $scope.dashboardDetails.contextPath + "/"+redirectPage;
						} else {
							return;
						}
					});
			}

			$scope.checkPendingApprovals = function() {

				if($scope.dashboardDetails.pendingApprovalsRedirectionPage == '')
					return;

				var sPageURL = window.location.search.substring(1);
				var sURLVariables = sPageURL.split('&');
				var foundLoggedInVar  = "false";
				for (var i = 0; i < sURLVariables.length; i++)
				{
					var sParameterName = sURLVariables[i].split('=');
					if (sParameterName[0] == "loggedin")
					{
						foundLoggedInVar  = "true";
						if(sParameterName[1] != "true")
							return;
					}
				}
				if(foundLoggedInVar == "true")
					$scope.redirectToPendingReqs($scope.dashboardDetails.pendingApprovalsRedirectionPage);
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

        $scope.updatedSyncArray = [];
        $scope.getDetails = function(sequence, req_no, teamselected, topic, consumergroup, acl_ip, acl_ssl, acltype) {

            var serviceInput = {};

            serviceInput['sequence'] = sequence;
            serviceInput['req_no'] = req_no;
            serviceInput['topicName'] = topic;
            serviceInput['teamSelected'] = teamselected;
            serviceInput['consumerGroup'] = consumergroup;
            serviceInput['aclIp'] = acl_ip;
            serviceInput['aclSsl'] = acl_ssl;
            serviceInput['aclType'] = acltype;
            serviceInput['envSelected'] = $scope.getAcls.envName;

            $scope.updatedSyncArray.push(serviceInput);
        }

        $scope.synchAcls = function() {

            var serviceInput = {};

            if(!$scope.getAcls.envName)
                return;

            swal({
            		title: "Are you sure?",
            		text: "You would like to Synchronize acls with this selection ? ",
            		type: "warning",
            		showCancelButton: true,
            		confirmButtonColor: "#DD6B55",
            		confirmButtonText: "Yes, please synchronize!",
            		cancelButtonText: "No, cancel please!",
            		closeOnConfirm: true,
            		closeOnCancel: true
            	}).then(function(isConfirm){
            		if (isConfirm.dismiss != "cancel") {
            		    $scope.ShowSpinnerStatus = true;
            			$http({
                            method: "POST",
                            url: "updateSyncAcls",
                            headers : { 'Content-Type' : 'application/json' },
                            params: {'syncAclUpdates' : $scope.updatedSyncArray },
                            data: $scope.updatedSyncArray
                        }).success(function(output) {
                            $scope.ShowSpinnerStatus = false;
                            $scope.alert = "Acl Sync Request : "+output.result;
                            $scope.updatedSyncArray = [];

//                            $scope.getAcls(1);
                             if(output.result == 'success'){
                              swal({
                            		   title: "",
                            		   text: "Acl Sync Request : "+output.result,
                            		   timer: 2000,
                            		   showConfirmButton: false
                            	   });
                            }else $scope.showSubmitFailed('','');
                        }).error(
                            function(error)
                            {
                                $scope.ShowSpinnerStatus = false;
                                $scope.handleErrorMessage(error);
                            }
                        );
            		} else {
            			return;
            		}
            	});

        }

	// We add the "time" query parameter to prevent IE
	// from caching ajax results

	$scope.getAcls = function(pageNoSelected) {

        if(!$scope.getAcls.envName || $scope.getAcls.envName == null)
            return;

        var serviceInput = {};
        $scope.alert = "";
        $scope.resultBrowse = [];

		serviceInput['env'] = $scope.getAcls.envName;
		$scope.ShowSpinnerStatusAcls = true;

		$http({
			method: "GET",
			url: "getSyncAcls",
            headers : { 'Content-Type' : 'application/json' },
            params: {'env' : $scope.getAcls.envName,
             'topicnamesearch' : $scope.getAcls.topicnamesearch,
             'showAllAcls' : "" + $scope.showAllAcls,
                'pageNo' : pageNoSelected,
                'currentPage' : $scope.currentPageSelected}
		}).success(function(output) {
		    $scope.ShowSpinnerStatusAcls = false;
			$scope.resultBrowse = output;
			if(output != null && output.length > 0){
                $scope.resultPages = output[0].allPageNos;
                $scope.resultPageSelected = pageNoSelected;
                $scope.currentPageSelected = output[0].currentPage;
            }
		}).error(
			function(error) 
			{
			    $scope.ShowSpinnerStatusAcls = false;
			    $scope.resultBrowse = [];
				$scope.handleErrorMessage(error);
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
                    $scope.alert = "Message Sent.";
                    swal({
                         title: "",
                         text: "Message sent.",
                         timer: 2000,
                         showConfirmButton: false
                     });
                }).error(
                    function(error)
                    {
                        $scope.alert = error;
                        $scope.alertnote = $scope.alert;
                        $scope.showAlertToast();
                    }
                );
        }

}
);