/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
 * Aliasing the Analytics API for easier usage
 */
var Analytics = {
	Util: com.yoelnunez.mobilefirst.analytics.util,
	API: com.yoelnunez.mobilefirst.analytics.AnalyticsAPI
};

/**
 * Get the Analytics Server information like endpoint, username,
 * and password form the JNDI configutation then set the server context
 */
(function() {
	var url = WL.Server.configuration['wl.analytics.url'],
		user = WL.Server.configuration['wl.analytics.username'],
		pass = WL.Server.configuration['wl.analytics.password'];
	
	var context = new Analytics.Util.ServerContext(url, user, pass);
	
	Analytics.API.setContext(context);
})();


/**
 * This is called when a username and password are provided by the user.
 * This method is referenced in the SecureRealm inside the authenticationConfig.xml
 * 
 * @param headers
 * @param errorMessage
 * @returns {___anonymous1735_1804}
 */
function onAuthRequired(headers, error){
	/** only log analytics if we have an error message
	 * i.e., user tried to login with the wrong credentials */  
	if(error) {
		var httpRequest = WL.Server.getClientRequest();
		
		var api = Analytics.API.createInstance(appContextFromRequest(httpRequest));
		
		api.log("authentication-required", JSON.stringify({
			userIp: httpRequest.getRemoteAddr(),
			loginFailure: error
		}));
		
		Analytics.API.send();
	}
	
	return {
		error: error,
		loginRequired: true
	};
}

/**
 * This method is called by MobileFirst when the user submits login credentials
 * 
 * @param username
 * @param password
 * @returns
 */
function submitAuthentication(username, password) {

	if (username === "demo") {
		if (password !== "demo") {
			return onAuthRequired(null, "Invalid Password");
		}

		WL.Server.setActiveUser("SecureRealm", {
			userId: username,
			displayName: username
		});
		
		return {
			loginRequired: false 
		};
	}

	return onAuthRequired(null, "User not found");
}

function onLogout(){
	WL.Logger.debug("Logged out");
}

/**
 * Creates an AppContext object from the request containing device and
 * application information i.e., app name, version, os, model, etc.
 * 
 * This is required to get an instance of the AnalyticsAPI
 * 
 * @param request
 * @returns {Analytics.Util.AppContext}
 */
function appContextFromRequest(request) {
	var context = new Analytics.Util.AppContext();

	context.setAppName(request.getHeader('x-wl-clientlog-appname'));
	context.setAppVersion(request.getHeader('x-wl-clientlog-appversion'));
	context.setDeviceID(request.getHeader('x-wl-device-id'));
	context.setDeviceOS(request.getHeader('x-wl-clientlog-env'));
	context.setDeviceOSVersion(request.getHeader('x-wl-clientlog-osversion'));
	context.setDeviceModel(request.getHeader('x-wl-clientlog-model'));
	
	return context;
}
