const http = require('http')
const url = require('url')
const port = process.env.PORT || 5000
const head = `<!DOCTYPE html>
<html>
<head>
<title>Kotilounas</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
body {font:14px Arial; margin: 1em; color: #333; line-height:1.3;}
h1, h2 {margin: 1em 0 .5em; font-weight: normal}
h1 {font-size:35px; }
h2 {font-size:25px; }
</style>
</head>
<body>
<h1>Vanhankaupunginkosken lounaslistat</h1>`
const startMsg = `Server started in http://localhost:${port}, took `
console.time(startMsg)
http.createServer((req, res) => {
    var uri = url.parse(req.url).pathname
    if(req.method === 'GET' && uri === '/') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        combineTemplate({
            koskenranta: 'http://koskenranta.net/fi/ravintola/lounas/',
            kahvitupa:   'http://kahvitupa.net/index.php?p=1_3'
        }, bodies => {
            res.end(`${head}
        <h2>Kahvitupa</h2>${mapKahvitupa(bodies.kahvitupa)}
        <h2>Koskenranta</h2>${mapKoskenranta(bodies.koskenranta)}
        </body></html>`)
        })
    } else {
        res.writeHead(404)
        res.end()
    }
}).listen(port, () => console.timeEnd(startMsg))

const weekdays = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai'].map(x=>x.toUpperCase())
const separateWeekDays = strs => strs.map(x=> x.match(new RegExp(`(${weekdays.join('|')})`, 'g')) ? `<br><strong>${x}</strong>` : x).join('<br>')
const stripTags = str => str.replace(/<[^>]+>/g, 'DIVIDER').split('DIVIDER')
    .map(x => x.replace(/&nbsp;/g, '')).filter(x=>x.trim().length)

const mapKoskenranta = str => separateWeekDays(stripTags(str.replace(/[\n|\t]/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]))

const mapKahvitupa = str => stripTags(str.replace(/[\n\r]+/g, '')
    .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
    .replace(/<p>&nbsp;<\/p>/g, '')).join('<br>')

const combineTemplate = (urls, cb) => {
    var names = Object.keys(urls)
    var results = {}
    names.forEach(name => get(urls[name], body => {
        results[name] = body
        if(Object.keys(results).length === names.length) cb(results)
    }))
}

const get = (url, cb) => {
    http.get(url, res => {
        var chunks = []
        res.setEncoding('utf8')
        res.on('data', chunk => chunks.push(chunk))
        res.on('end', () => cb(chunks.join('')))
    })
}