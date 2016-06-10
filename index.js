const http = require('http')
const port = process.env.PORT || 5000
const head = `<!DOCTYPE html>
<html>
<head>
<title>Kotilounas</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
* {font-size:14px; font-family: Arial;text-align:left !important;margin:0; padding:0;}
table, tr, th, td {display:block !important;}
body {margin: 1em; color: #333;}
.title {font-size:35px; margin: 2em 0 1em;}

</style>
</head>
<body>`
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    combineTemplate({
            koskenranta: 'http://koskenranta.net/fi/ravintola/lounas/',
            kahvitupa:   'http://kahvitupa.net/index.php?p=1_3'
        }, bodies => {
            const body = `${head}
        <div class="title">Kahvitupa</div>${mapKahvitupa(bodies.kahvitupa)}
        <div class="title">Koskenranta</div>${mapKoskenranta(bodies.koskenranta)}
        </body></html>`
            res.end(body)
        }
    )
}).listen(port)

function mapKoskenranta(str) {
    return str.replace(/\n/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]
}

function mapKahvitupa(str) {
    return str.replace(/[\n\r]+/g, '')
        .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
        .replace(/<p>&nbsp;<\/p>/g, '')
}

function combineTemplate(urls, cb) {
    var names = Object.keys(urls)
    var results = {}
    names.forEach(name => get(urls[name], body => {
        results[name] = body
        if(Object.keys(results).length === names.length) cb(results)
    }))
}
function get(url, cb) {
    http.get(url, res => {
        var chunks = []
        res.setEncoding('utf8')
        res.on('data', chunk => chunks.push(chunk))
        res.on('end', () => cb(chunks.join('')))
    })
}