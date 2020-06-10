//---------------Authenticate user
function authenticate(){

   var poolData = {
     UserPoolId: '<POOL_ID>', // Your user pool id here
     ClientId: '<APP_CLIENT_ID>' // client ID require MFA
    };
   var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var authenticationData = {
      Username: username,
      Password: password
    };

    var userData = {
      Username: username,
      Pool: userPool,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
    cognitoUser.authenticateUser(authenticationDetails, {

      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var idToken = result.getIdToken().getJwtToken();
        var refreshToken = result.getRefreshToken().getToken();

      },
      totpRequired: function(codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            var mfaCode = prompt("Enter OTP MFA Code");
            cognitoUser.sendMFACode(mfaCode, this, 'SOFTWARE_TOKEN_MFA');
      },
      onFailure: function(err) {
        console.error(err);
        console.log(err.message || JSON.stringify(err));
      },
    });
}
