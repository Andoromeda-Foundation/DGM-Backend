// Add assertion for Config File
const assertion = require('../assert')

const etherscanAPIList = require('./etherscanAPI.json')
const eventTopicHex = require('./topic.json')

// Please provide ENV `contract` and `network` in your docker container
const contract = process.env.contract
assertion.checkContract(contract)

const network = process.env.network
assertion.checkNetwork(network)

const api = process.env.api || 'http://dasdaq-webapi.chinacloudsites.cn'



const etherscanAPI = etherscanAPIList[network]


module.exports = {
    eventTopicHex,
    contract,
    etherscanAPI,
    api
}