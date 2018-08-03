const chalk = require('chalk')

const simpleLogger = (mod, stat) => {
    const time = new Date().toLocaleString()
    console.log(`${chalk.blue(mod)}  @${chalk.bold.white.bgBlack(time)}   ${chalk.green(stat)}`) 
}

module.exports = simpleLogger