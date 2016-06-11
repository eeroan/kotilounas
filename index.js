const http = require('http')
const url = require('url')
const parser = require('./parser')
const port = process.env.PORT || 5000
const head = `<!DOCTYPE html>
<html>
<head>
<title>Kotilounas</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
body {font:1em Arial; margin: 0; color: #333; line-height:1.3;background: #F0FFF2}
h1, h2 {margin: 0 0 .5em; font-weight: normal}
h1 {font:2em Impact; margin: 20px 20px .5em;text-shadow: 0 1px 8px #666; color:#fff;}
h2 {font-size:1.6em; }
section { box-shadow: 0px 1px 3px 0px #999; margin:20px; padding:1em; border-radius:3px;background:#fff;}
</style>
</head>
<body>
<h1>Vanhan&shy;kaupungin&shy;kosken lounaslistat</h1>`
const startMsg = `Server started in http://localhost:${port}, took `
const gaCode = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4154602-9', 'auto');
  ga('send', 'pageview');

</script>`
console.time(startMsg)
http.createServer((req, res) => {
    var uri = url.parse(req.url).pathname
    if(req.method === 'GET' && uri === '/') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        combineTemplate({
            koskenranta: 'http://koskenranta.net/fi/ravintola/lounas/',
            kahvitupa:   'http://kahvitupa.net/index.php?p=1_3'
        }, ({kahvitupa, koskenranta}) => {
            res.end(`${head}
        <section><h2>Kahvitupa</h2>${parser.mapKahvitupa(kahvitupa)}</section>
        <section><h2>Koskenranta</h2>${parser.mapKoskenranta(koskenranta)}</section>
        ${gaCode}
        </body></html>`)
        })
    } else {
        res.writeHead(404)
        res.end()
    }
}).listen(port, () => console.timeEnd(startMsg))

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