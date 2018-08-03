const request = require('superagent')
const config = require('../config')
const { decodeHexedDataNumber, blockTimeStamp, getPriceFromData } = require('../util')


async function fetchEventData(fromBlock) {
    const url = 'https://api-kovan.etherscan.io/api'
    const { body } = await request.get(url).query({
        module: 'logs'
        , action: 'getLogs'
        , fromBlock
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

            const count = Number(txInfo[0])
            const price = getPriceFromData(txInfo)
            const getAddrFromHex = (hex) => `0x${hex.slice(-40)}`
            return {
                transactionHash,
                method,
                count,
                price,
                timeStamp: blockTimeStamp(timeStamp),
                user: getAddrFromHex(topics[1]),
            }
        })
    return txsDetail
}

async function getFilteredTxs(fromBlock = 0) {
    const txs = await fetchEventData(fromBlock)
    const methodFilter = (name) => ({ method }) => method === name
    const purchaseHistory = txs.filter(methodFilter('onTokenPurchase'))
    const sellHistory = txs.filter(methodFilter('onTokenSell'))
    return { purchaseHistory, sellHistory }
}

module.exports = {
    getFilteredTxs
}