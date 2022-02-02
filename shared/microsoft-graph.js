const {Client} = require("@microsoft/microsoft-graph-client");
const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {DefaultAzureCredential} = require("@azure/identity");
require('isomorphic-fetch');

const init = () =>{
    const credential = new DefaultAzureCredential();
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });
    
    const client = Client.initWithMiddleware({
        debugLogging: true,
        authProvider
    });
    return client;
}
const getUserFromGraph = async (userEmail) =>{

    let client = init();

    let status = {
        isFound: false,
        error: null,
        user: null
    }

    if(!client) throw new Error("Azure Storage client is empty");
    if(!userEmail) throw new Error("userEmail is empty");

    try{
        status.user = await client.api(`/users/${userEmail}`).get();
        status.isFound = true;
    } catch (err){
        status.error = err;

        if(!err.code==='Request_ResourceNotFound'){
            throw err;
        }
    }finally{
        return status;
    }
}

module.exports = {
    getUserFromGraph
}