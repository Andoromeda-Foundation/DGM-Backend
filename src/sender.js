const request = require('superagent')
const logger = require('./util/logger')

const API = 'http://dasdaq-webapi.chinacloudsites.cn'

function sendTransactions(values) {
    logger('sendTransactions', 'OK')
    return request.post(`${API}/api/Transaction`).send({ values })
}

function sendCandlestick(values) {
    logger('sendCandlestick', 'OK')
    return request.post(`${API}/api/Candlestick`).send({ values })
}

async function sendTransactionsAndCandlestick({ purchaseHistory, sellHistory }) {
    const txs = purchaseHistory.concat(sellHistory)
    const candlestickData = txs.map(({ price, timeStamp }) => {
        const catalog = "dgm"
        const utcTime = new Date(timeStamp).toISOString()
        return { catalog, price, utcTime }
    })
    const transactionsData = txs.map(({ method, price, timeStamp, count, user }) => {
        const catalog = method === "onTokenPurchase" ? 'dgm-buy' : 'dgm-sell'
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