// Pre-requisites ...
//
// 1- User pool must be created with MFA optional
// 2- User must have software token assigned (this has to be done from the app through assignSoftwareToken/confirmSoftwareToken APIs)
// 3- MFA settings set to disabled
//
// DefineAuthChallenge lambda trigger
//
var clientIdRequireMfa = 'APP_CLIENT_ID';

exports.handler = (event, context, callback) => {
    var clientId = event.callerContext.clientId;

    if (event.request.session.length == 1 && event.request.session[0].challengeName == 'SRP_A') {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'PASSWORD_VERIFIER';

    } else if (event.request.session.length == 2 && 
            event.request.session[1].challengeName == 'PASSWORD_VERIFIER' && 
            event.request.session[1].challengeResult == true) {

        if(clientId == clientIdRequireMfa){
            event.response.issueTokens = false;
            event.response.failAuthentication = false;
            event.response.challengeName = 'SOFTWARE_TOKEN_MFA';
        }else{
            event.response.issueTokens = true;
            event.response.failAuthentication = false;
        }

    } else if (event.request.session.length == 3 && 
            event.request.session[2].challengeName == 'SOFTWARE_TOKEN_MFA' && 
            event.request.session[2].challengeResult == true) {

        event.response.issueTokens = true;
        event.response.failAuthentication = false;
    } else {
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
    }

    // Return to Amazon Cognito
    callback(null, event);
}
