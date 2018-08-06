const ramda = require('ramda')
const { splitEvery, compose, map } = ramda

function blockTimeStamp(timeStamp) {
    return parseInt(timeStamp, 16) * 1000
}


function decodeHexedDataNumber(dataHex) {
    const remove0xPrefix = (str) => str.slice(2)
    const splitIntoHexArray = splitEvery(64)
    const add0x = str => (`0x${str.slice(2)}`)
    const hexToDecimalStr = hex => parseInt(hex, 16).toString()
    // (Ramda) Compose exec fns from the bottom to the top 😄, functional style
    const result = compose(
        map(hexToDecimalStr),
        map(add0x),
        splitIntoHexArray,
        remove0xPrefix,
    )(dataHex)
    console.log(result)
    return result
}

function getPriceFromData(data) {
    let [tokenQty, ethPaid] = data
    return (Number(ethPaid) / Number(tokenQty))
}

module.exports = {
    blockTimeStamp,
    decodeHexedDataNumber,
    getPriceFromData
}

