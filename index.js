const http = require('http')
const url = require('url')
const fs = require('fs')
const {mapKahvitupa, mapKoskenranta} = require('./parser')
const port = process.env.PORT || 5000
const startMsg = '\033[33mServer started in \033[36mhttp://localhost:' + port + ', \033[33mtook \033[39m'
console.time(startMsg)

http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname
    if(req.method === 'GET') {
        switch (uri) {
            case  '/':
                writePage(res)
                break
            case '/menu.png':
                serveImg('menu.png', res)
                break
            case '/favicon.ico':
                serveImg('favicon.ico', res)
                break
            default:
                notFound(res)
        }
    } else {
        notFound(res)
    }
}).listen(port, () => console.timeEnd(startMsg))

const writePage = res => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    combineTemplate({
        koskenranta: 'http://koskenranta.net/fi/ravintola/lounas/',
        kahvitupa:   'http://kahvitupa.net/index.php?p=1_3'
    }, ({kahvitupa, koskenranta}) => {
        res.end(`${head}
        <section><h2>Kahvitupa</h2>${mapKahvitupa(kahvitupa)}</section>
        <section><h2>Koskenranta</h2>${mapKoskenranta(koskenranta, new Date())}</section>
        ${gaCode}
        </body></html>`)
    })
}

const serveImg = (path, res) => {
    const img = fs.readFileSync(path, 'binary')
    res.writeHead(200)
    res.write(img, 'binary')
    res.end()
}
const notFound = res => {
    res.writeHead(404)
    res.end()
}
const combineTemplate = (urls, cb) => {
    const names = Object.keys(urls)
    const results = {}
    names.forEach(name => get(urls[name], body => {
        results[name] = body
        if(Object.keys(results).length === names.length) cb(results)
    }))
}
const get = (url, cb) => http.get(url, res => {
    const chunks = []
    res.setEncoding('utf8')
    res.on('data', chunk => chunks.push(chunk))
    res.on('end', () => cb(chunks.join('')))
})
const head = `<!DOCTYPE html>
<html>
<head>
<title>Kotilounas</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="apple-touch-icon" href="menu.png"/>
<link id="page_favicon" href="/favicon.ico" rel="icon" type="image/x-icon"/>
<style>
@import url(https://fonts.googleapis.com/css?family=Oswald|Droid+Sans);
body {font:1em 'Droid Sans', sans-serif; margin: 0; color: #333; line-height:1.3;background: #F0FFF2}
h1, h2 {margin: 0 0 .5em; font-weight: normal}
h1 {font:2em 'Oswald', sans-serif; margin: 20px 20px .5em;text-shadow: 0 1px 6px #666; color:#fff;}
h2 {font-size: 1.2em; background:#ccc; text-shadow: 0 1px 6px #666;margin:-20px -20px 20px;padding:10px 20px 10px;color:#fff;}
section { box-shadow: 0px 1px 3px 0px #999; margin:20px; padding:20px; border-radius:3px;background:#fff;}
</style>
</head>
<body>
<h1>Vanhan&shy;kaupungin&shy;kosken lounaslistat</h1>`

const gaCode = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-4154602-9', 'auto');
  ga('send', 'pageview');

</script>`
