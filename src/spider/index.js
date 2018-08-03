const request = require('superagent')
const config = require('../config')
const { decodeHexedDataNumber, blockTimeStamp, getPriceFromData } = require('../util')


async function fetchEventData() {
    const url = 'https://api-kovan.etherscan.io/api'
    const { body } = await request.get(url).query({
        module: 'logs'
        , action: 'getLogs'
        , fromBlock: 0
        , toBlock: 'latest'
        , address: '0xb1129323A3B9f47c8cAC1BADEc67Acab71582f08'
        , apikey: '64AYEBDDFGFM8YBXC2BKQ2P8587PTSF4WR'
    })
    const { status, result } = body
    if (status !== "1") {
        console.error('Error Happened.')
        return 1;
    }
    const { eventTopicHex } = config
    const buyAndSellTxOnly = tx => tx.topics[0] === eventTopicHex.onTokenPurchase || tx.topics[0] === eventTopicHex.onTokenSell
    const txsDetail = result
        .filter(buyAndSellTxOnly)
        .map(tx => {
            const { topics, data, timeStamp, transactionHash } = tx
            let method, txInfo;
            switch (topics[0]) {
                case eventTopicHex.onTokenPurchase:
                    method = 'onTokenPurchase'
                    txInfo = decodeHexedDataNumber(data).reverse()
                    break;
                case eventTopicHex.onTokenSell:
                    method = 'onTokenSell'
                    txInfo = decodeHexedDataNumber(data)
                    break;
                default:
                    method = topics[0]
                    break;
            }

            // const [tokenQty, ethPaid] = txInfo
            const price = getPriceFromData(txInfo)
            return {
                transactionHash,
                method,
                price,
                timeStamp: blockTimeStamp(timeStamp)
            }
        })
    return txsDetail
}

async function getFilteredTxs() {
    const txs = await fetchEventData()
    const methodFilter = (name) => ({ method }) => method === name
    const purchaseHistory = txs.filter(methodFilter('onTokenPurchase'))
    const sellHistory = txs.filter(methodFilter('onTokenSell'))
    return { purchaseHistory, sellHistory }
}

getFilteredTxs().then(
    txs => {
        const { purchaseHistory, sellHistory } = txs
        console.log('Purchase History:' + JSON.stringify(purchaseHistory))
        console.log('Sell History:' + JSON.stringify(sellHistory))
    }
)

module.exports = {
    getFilteredTxs
}