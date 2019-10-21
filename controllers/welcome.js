module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('welcome.html', {
            title: 'Welcome'
        });
    }
};