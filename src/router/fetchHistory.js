const { getFilteredTxs } = require('../spider')

const fetchHistory = async (ctx) => {
    const { purchaseHistory, sellHistory } = await getFilteredTxs()
    const code = 200
    ctx.response.status = code
    ctx.body = {
        code,
        purchaseHistory,
        sellHistory
    }
}

module.exports = fetchHistory