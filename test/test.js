const assert = require('assert')
const {mapKahvitupa, mapKoskenranta, mapDylanArabia} = require('../parser')
const fs = require('fs')

const readFile = path => fs.readFileSync(`${__dirname}/${path}`, {encoding: 'utf8'}).trim()
const writeErrorFiles = obj => Object.keys(obj).forEach(key => fs.writeFileSync(`${__dirname}/../output/${key}.txt`, obj[key], {encoding: 'utf8'}))
const createDirIfMissing = dir => fs.existsSync(dir) || fs.mkdirSync(dir)
const equal = (msg, expected, actual) => {
    console.log('- ' + msg)
    try {
        assert.equal(expected, actual)
    } catch(err) {
        createDirIfMissing(`${__dirname}/../output`)
        writeErrorFiles({expected, actual})
        throw err
    }
}
console.log('\033[33mRunning tests...\033[39m')

equal('Kahvitupa result is correct',
    mapKahvitupa(readFile('kahvitupa.html')),
    readFile('expectedKahvitupa.txt')
)
equal('Koskenranta result is correct',
    mapKoskenranta(readFile('koskenranta.html'), new Date(2017, 1, 13)),
    readFile('expectedKoskenranta.txt')
)
equal('Dylan result is correct',
    mapDylanArabia(readFile('dylan.html')),
    readFile('expectedDylan.txt')
)
console.log('\033[32mAll tests passed!\033[39m');
