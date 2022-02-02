const { getUserFromGraph } = require('../shared/microsoft-graph');

module.exports = async function (context, req) {

    try{

    const email = (req.query.email);

    if(!email){
        context.res = {
            status: 404
        };
    } else {

        const userState = await getUserFromGraph(email);
        context.log(`isFound ${email}==${userState.isFound}`);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: userState
        };
    }
    }catch(err){
        context.res = {
            status: 500, 
            body: err
        };
    }

}