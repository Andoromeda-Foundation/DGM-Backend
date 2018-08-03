const Koa = require('koa')
const bodyParser = require("koa-bodyparser")
// CORS
const CORS = require("./middleware/cors")
// Routers
const { routerRules, allowedMethods } = require("./router")
// Logger
const { logger, xResponseTime } = require("./util/logger")


// Start the Koa App
const app = new Koa()
// Body Parser and CORS setting
app.use(bodyParser())
    .use(CORS)


// log response-time
app.use(logger)
    .use(xResponseTime)

// router
app.use(routerRules)
    .use(allowedMethods)


const port = '1234'
app.listen(port)