// index:
// index:

module.exports = {
    'POST /go': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    }
};