function wlCommonInit(){

}

function getSecretData(){
	WL.Client.invokeProcedure({
		adapter: 'SecureAdapter',
		procedure: 'getSecretData',
		params: []
	}).then(getSecretDataSucess).fail(getSecretDataFailure);
}

function getSecretDataSucess(response){
	$("#ResponseDiv").html(JSON.stringify(response.responseJSON));
}

function getSecretDataFailure(response){
	$("#ResponseDiv").html(response.errorMsg);
}
