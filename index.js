const express = require('express')
const request = require('request')
const app = express()
const port = 5000
app.listen(port, () => console.log(`Started server in port ${port}`))
const head = `<!DOCTYPE html>
<html>
<head>
<title>Kotilounas</title>
<style>
* {font-size:14px; font-family: Arial;text-align:left !important;margin:0; padding:0;}
table, tr, th, td {display:block !important;}
body {margin: 1em; color: #333;}
.title {font-size:35px; margin: 2em 0 1em;}

</style>
</head>
<body>`
app.get('/', function (req, res) {
    combineAsArray([
            'http://koskenranta.net/fi/ravintola/lounas/',
            'http://kahvitupa.net/index.php?p=1_3'
        ], bodies => {
        const body = `${head}
        <div class="title">Kahvitupa</div>${mapKahvitupa(bodies[1])}
        <div class="title">Koskenranta</div>${mapKoskenranta(bodies[0])}
        </body></html>`
        res.send(body)
        }
    )
})

function mapKoskenranta(str) {
    return str.replace(/\n/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]
}

function mapKahvitupa(str) {
    return str.replace(/[\n\r]+/g, '')
        .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
        .replace(/<p>&nbsp;<\/p>/g, '')
}
function combineAsArray(urls, cb) {
    const bodies = []
    urls.forEach((url, i) => request(url, (error, response, body) => {
        bodies[i] = body
        if (bodies.filter(x => x).length === urls.length) cb(bodies)
    }))
}