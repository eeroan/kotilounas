const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const path = require('path')
const parser = require('./parser')
const port = process.env.PORT || 5000
const startMsg = '\033[33mServer started in \033[36mhttp://localhost:' + port + ', \033[33mtook \033[39m'
const startedTime = new Date().toString()
const koskenrantaUrl = 'http://koskenranta.net/fi/ravintola/lounas/'
const kahvitupaUrl = 'http://kahvitupa.net/index.php?p=1_3'
const dylanArabiaApiUrl = 'https://graph.facebook.com/v2.8/DylanArabia/posts?access_token=' + process.env.FACEBOOK_API_TOKEN
const dylanArabiaUrl = 'https://www.facebook.com/DylanArabia'
console.time(startMsg)
http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname
    const isGet = req.method === 'GET'
    if(isGet && uri === '/')
        writePage(res)
    else if(isGet && uri.startsWith('/public'))
        serveStatic(uri, res)
    else
        notFound(res)
}).listen(port, () => console.timeEnd(startMsg))

const serveStatic = (uri, res) => {
    const fsPath = __dirname + path.normalize(uri)
    res.writeHead(200)
    const fileStream = fs.createReadStream(fsPath)
    fileStream.pipe(res)
    fileStream.on('error', () => {
        res.writeHead(404)
        res.end()
    })
}
const section = (title, url, body) => `<section><h2><span>${title}</span><a target="_blank" href="${url}">&#128279;</a></h2>${body}</section>`
const writePage = res => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.write('<!DOCTYPE html>')
    res.write(head)
    combineTemplate({
        koskenranta: koskenrantaUrl,
        kahvitupa:   kahvitupaUrl,
        dylanArabia: dylanArabiaApiUrl
    }, ({kahvitupa, koskenranta, dylanArabia}) => {
        res.end(`${section('Kahvitupa', kahvitupaUrl, parser.mapKahvitupa(kahvitupa))}
        ${section('Koskenranta', koskenrantaUrl, parser.mapKoskenranta(koskenranta, new Date()))}
        ${section('Dylan Arabia', dylanArabiaUrl, parser.mapDylanArabia(dylanArabia, new Date()))}
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

const responses = {}
const getCached = (url, cb) => {
    if(url in responses) cb(responses[url])
    else get(url, data => {
        responses[url] = data
        cb(data)
    })
}
const get = (url, cb) => (url.startsWith('https') ? https : http).get(url, res => {
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
<p class="subtitle">Tänään on ${parser.formatToday()}.</p>`

const gaCode = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4154602-9', 'auto');
  ga('send', 'pageview');
</script>`
