const chai = require('chai')
const { expect } = chai

function checkContract(address) {
    let obj = expect(address)
    obj.to.be.a('string', 'ENV [`contract` not defined]')
    obj.to.have.lengthOf(42,  'ENV [`contract` not eth address]')
}

function checkNetwork(network) {
    let obj = expect(network)
    obj.to.be.a('string')
}

module.exports = {
    checkContract,
    checkNetwork
}