const fn_dbrun = require('../db');

var fn_db = async(ctx, next) => {
    
    fn_dbrun();
    //var name = ctx.params.name;
    ctx.response.body = `<h1>Successful!</h1>`;
};


module.exports = {
    'GET /db': fn_db
};