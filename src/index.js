const { getFilteredTxs } = require('./spider')
const sender = require('./sender')
const simpleLogger = require('./util/logger')

const intervalSec = 60

function fetchData() {
    getFilteredTxs().then(({ purchaseHistory, sellHistory }) => {
        simpleLogger('Fetch Event', 'OK')
        sender({ purchaseHistory, sellHistory })
            .then(() => {
                simpleLogger('SEND Data', 'OK')
            })
    })
}

fetchData()
setInterval(() => fetchData(), 1000 * intervalSec)