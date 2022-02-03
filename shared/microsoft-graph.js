const {Client} = require("@microsoft/microsoft-graph-client");
const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {
    AuthorizationCodeCredential
} = require("@azure/identity");
const fs = require('fs').promises;
const path = require('path');
require('isomorphic-fetch');
const { getAzureCredentialForGraph } = require('./azure-credential');

const getUserFromGraph = async (userEmail) =>{

    let client = getAzureCredentialForGraph();

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