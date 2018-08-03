const Router = require("koa-router");
const fetchHistory = require("./fetchHistory");

const router = new Router();

router.get('/', async (ctx) => {
    const code = 404
    ctx.response.status = code
    ctx.body = {
        code,
        message: 'Hi, Please checkout the API'
    }
});

const pingpong = async (ctx) => {
    const code = 200
    ctx.response.status = code
    ctx.body = {
        code,
        message: 'pong'
    }
}


router.get('/ping', pingpong);
router.get('/history', fetchHistory);

module.exports = {
    routerRules: router.routes(),
    allowedMethods: router.allowedMethods()
}
