const {DefaultAzureCredential, ClientSecretCredential} = require("@azure/identity");
const {Client} = require("@microsoft/microsoft-graph-client");
const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
require('isomorphic-fetch');
const fs = require('fs').promises;
const path = require('path');

const localSettingsToEnvironment = async () => {

    const fileName = "./local.settings.json";

    try {
        const environmentFilePath = path.join(__dirname, fileName);
        const data = await fs.readFile(environmentFilePath, 'utf8');

        if(!data) throw Error("environment file not found");

        const jsonData = JSON.parse(data);
        for(let setting in jsonData.Values){
            process.env[setting] = jsonData.Values[setting];
        }

    } catch (err) {
        console.error(err)
    }
}
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
const getUserFromGraph = async (userEmail) =>{

    await localSettingsToEnvironment();
    let client = getAzureCredentialForGraph();

    let status = {
        isFound: false,
        error: null,
        user: null
    }

    if(!client) throw new Error("Client is empty");
    if(!userEmail) throw new Error("userEmail is empty");

    try{
        status.user = await client.api(`/users/${userEmail}`).get();
        status.isFound = true;
        console.log('user is found');
    } catch (err){
        console.log(err);
        status.error = err;

        if(!err.code==='Request_ResourceNotFound'){
            throw err;
        }
    }finally{
        return status;
    }
}
const main = async() =>{
    await localSettingsToEnvironment();
    const user = await getUserFromGraph(process.env.TEST_USER_2);
}

main().then(()=>{
    console.log('done');
}).catch(err=>{
    console.log(err);
})