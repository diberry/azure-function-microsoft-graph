const { findAndRemoveOldUsers } = require('./find-and-remove-old-users');

module.exports = async function (context, req) {
    
    try{
        context.log('removeOldUsers');

        const {results, metadata} = await findAndRemoveOldUsers();

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { results, metadata }
        };
    }catch(err){
        context.res = {
            status: 500, 
            body: err
        };
    }
}