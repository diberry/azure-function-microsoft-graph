const { getUsers, removeUser } = require('./azure-sql-sequelize');
const { getUserFromGraph } = require('./microsoft-graph');

const findAndRemoveOldUsers = async () =>{
    
    let returnResults;
    
    const { results, metadata } = await getUsers();

    returnResults = {       
        results, metadata
    }

    for await (let user of results) {

        // Find user by email in Microsoft Graph
        const userReturned = await getUserFromGraph(user.MSFTEmail);
        user.graph = userReturned;

        // if user isn't in Microsoft Graph
        if(!user.graph.isFound){
            
            console.log(user.graph);

            // remove from app database
            //const { results, metadata } = await removeUser(userReturned.user.msftEmail);
            //user.removed = {
            //    results, metadata
            //};
        }
    }
}

module.exports = {
    findAndRemoveOldUsers
}