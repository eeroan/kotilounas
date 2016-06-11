const assert = require('assert')
const {mapKahvitupa, mapKoskenranta} = require('../parser')
const {readFileSync} = require('fs')

const readFile = path => readFileSync(`${__dirname}/${path}`, {encoding: 'utf8'})
const equal = (msg, expected, actual) => {
    console.log('- ' + msg)
    assert.equal(expected, actual)
}
console.log('\033[33mRunning tests...\033[39m')

equal('Kahvitupa result is correct',
    mapKahvitupa(readFile('kahvitupa.html')),
    readFile('expectedKahvitupa.txt')
)
equal('Koskenranta result is correct',
    mapKoskenranta(readFile('koskenranta.html'), new Date(2016,6,15)),
    readFile('expectedKoskenranta.txt')
)
console.log('\033[32mAll tests passed!\033[39m');