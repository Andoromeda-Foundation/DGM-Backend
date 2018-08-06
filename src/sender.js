const request = require('superagent')
const logger = require('./util/logger')
const config = require('./config')

const API = config.api

function sendTransactions(values) {
    logger('sendTransactions', 'OK')
    const payload = { values }
    return request.post(`${API}/api/Transaction`).send(payload)
}

function sendCandlestick(values) {
    logger('sendCandlestick', 'OK')
    const payload = { values }
    return request.post(`${API}/api/Candlestick`).send(payload)
}

async function sendTransactionsAndCandlestick({ purchaseHistory, sellHistory }) {
    const txs = purchaseHistory.concat(sellHistory)
    const candlestickData = txs.map(({ price, timeStamp }) => {
        const catalog = "dgm"
        const utcTime = new Date(timeStamp).toISOString()
        return { catalog, price, utcTime }
    })
    const transactionsData = txs.map(({ method, price, timeStamp, count, user }) => {
        const catalog = method === "onTokenPurchase" ? 'dgm_buy' : 'dgm_sell'
        const utcTime = new Date(timeStamp).toISOString()
        return {
            catalog,
            price,
            count,
            user,
            utcTime
        }
    })
    await sendCandlestick(candlestickData)
    await sendTransactions(transactionsData)
}

module.exports = sendTransactionsAndCandlestick