const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const {mapKahvitupa, mapKoskenranta, formatToday} = require('./parser')
const port = process.env.PORT || 5000
const startMsg = '\033[33mServer started in \033[36mhttp://localhost:' + port + ', \033[33mtook \033[39m'
const startedTime = new Date().toString()
console.time(startMsg)
const baseDirectory = __dirname
http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname
    if(req.method === 'GET') {
        // need to use path.normalize so people can't access directories underneath baseDirectory

        switch (uri) {
            case  '/':
                writePage(res)
                break
            default:
                if(uri.startsWith('/public')) {
                    serveStatic(uri, res)
                } else {
                    notFound(res)
                }
        }
    } else {
        notFound(res)
    }
}).listen(port, () => console.timeEnd(startMsg))

const serveStatic = (uri, res) => {
    var fsPath = baseDirectory + path.normalize(uri)
    res.writeHead(200)
    var fileStream = fs.createReadStream(fsPath)
    fileStream.pipe(res)
    fileStream.on('error', function (e) {
        res.writeHead(404)
        res.end()
    })
}
const writePage = res => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.write('<!DOCTYPE html>')
    res.write(head)

    const koskenrantaUrl = 'http://koskenranta.net/fi/ravintola/lounas/'
    const kahvitupaUrl = 'http://kahvitupa.net/index.php?p=1_3'
    combineTemplate({
        koskenranta: koskenrantaUrl,
        kahvitupa:   kahvitupaUrl
    }, ({kahvitupa, koskenranta}) => {
        res.end(`<section><h2><span>Kahvitupa</span><a target="_blank" href="${kahvitupaUrl}">&#128279;</a></h2>${mapKahvitupa(kahvitupa)}</section>
        <section><h2><span>Koskenranta</span><a target="_blank" href="${koskenrantaUrl}">&#128279;</a></h2>${mapKoskenranta(koskenranta, new Date())}</section>
        ${gaCode}
        <p class="subtitle">
        <i><a href="https://github.com/eeroan/kotilounas">Lähdekoodi</a></i>
        </p></body></html>`)
    })
}

const notFound = res => {
    res.writeHead(404)
    res.end()
}
const combineTemplate = (urls, cb) => {
    const names = Object.keys(urls)
    const results = {}
    names.forEach(name => getCached(urls[name], body => {
        results[name] = body
        if(Object.keys(results).length === names.length) cb(results)
    }))
}

var responses = {}
const getCached = (url, cb) => {
    if(url in responses) {
        cb(responses[url])
    } else {
        get(url, data => {
            responses[url] = data
            cb(data)
        })
    }
}
const get = (url, cb) => http.get(url, res => {
    const chunks = []
    res.setEncoding('utf8')
    res.on('data', chunk => chunks.push(chunk))
    res.on('end', () => cb(chunks.join('')))
})

const head = `<html>
<head>
<!-- Server started: ${startedTime}-->
<title>Kotilounas</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="apple-touch-icon" href="menu.png"/>
<link id="page_favicon" href="/favicon.ico" rel="icon" type="image/x-icon"/>
<link rel="stylesheet" type="text/css" href="public/styles.css"/>
</head>
<body>
<h1>Vanhan&shy;kaupungin&shy;kosken lounaslistat</h1>
<p class="subtitle">Tänään on ${formatToday()}.</p>`

const gaCode = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4154602-9', 'auto');
  ga('send', 'pageview');

</script>`
