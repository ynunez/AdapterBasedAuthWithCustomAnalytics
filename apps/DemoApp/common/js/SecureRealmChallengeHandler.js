var SecureRealmChallengeHandler = WL.Client.createChallengeHandler("SecureRealm");

SecureRealmChallengeHandler.isCustomResponse = function(response) {
	if (!response || !response.responseJSON	|| response.responseText === null) {
		return false;
	}
	if (typeof(response.responseJSON.loginRequired) !== 'undefined'){
		return true;
	} else {
		return false;
	}
};

SecureRealmChallengeHandler.handleChallenge = function(response){
	if (response.responseJSON.loginRequired){
		$("#AppDiv").hide();
		$("#AuthDiv").show();
		$("#AuthPassword").empty();
		$("#AuthInfo").empty();

		if (response.responseJSON.error) {
			$("#AuthInfo").html(response.responseJSON.error);
		}
	} else {
		$("#AppDiv").show();
		$("#AuthDiv").hide();
		SecureRealmChallengeHandler.submitSuccess();
	}
};


$("#AuthSubmitButton").bind('click', function () {
	var username = $("#AuthUsername").val();
	var password = $("#AuthPassword").val();

	var invocationData = {
		adapter : "AuthAdapter",
		procedure : "submitAuthentication",
		parameters : [ username, password ]
	};

	SecureRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
});

$("#AuthCancelButton").bind('click', function () {
	$("#AppDiv").show();
	$("#AuthDiv").hide();
	SecureRealmChallengeHandler.submitFailure();
});