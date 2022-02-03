const {DefaultAzureCredential, ClientSecretCredential} = require("@azure/identity");
const {Client} = require("@microsoft/microsoft-graph-client");
const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {
    AuthorizationCodeCredential
} = require("@azure/identity");

const getAzureCredentialForGraph = () =>{

    // Instead of letting DefaultAzureCredential choose, 
    // we choose so the correct service principal for this app
    // is used
    const tenantId = process.env["AZURE_TENANT_ID"]; 
    const clientId = process.env["AZURE_CLIENT_ID"]; 
    const clientSecret = process.env["AZURE_CLIENT_SECRET"];

    if(!tenantId || !clientId || !clientSecret) throw Error("getAzureCredentialForGraph::required params are missing");

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });
    const client = Client.initWithMiddleware({
        debugLogging: true,
        authProvider
    });
    return client;
}

module.exports = {
    getAzureCredentialForGraph
}