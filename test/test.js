const assert = require('assert')
const parser = require('../parser')
const fs = require('fs')

const readFile = path => fs.readFileSync(`${__dirname}/${path}`, {encoding: 'utf8'})
const normalize = str => str.replace(/\n/g, '')
const equal = (msg, expected, actual) => {
    console.log('- ' + msg)
    assert.equal(expected, actual)
}
console.log('\033[33mRunning tests...\033[39m')

equal('Kahvitupa result is correct',
    parser.mapKahvitupa(readFile('kahvitupa.html')),
    normalize(readFile('expectedKahvitupa.txt'))
)
equal('Koskenranta result is correct',
    parser.mapKoskenranta(readFile('koskenranta.html')),
    normalize(readFile('expectedKoskenranta.txt'))
)
console.log('\033[32mAll tests passed!\033[39m');