const express = require('express')
const app = express()
const port = 5000
app.listen(port, () => console.log(`Started server in port ${port}`))
app.get('/', function (req, res) {
    res.send('Hello World')
})