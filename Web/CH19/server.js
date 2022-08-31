const http = require('http')
const fs = require('fs')

const html = fs.readFileSync('index.html', 'utf-8')

http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end("<h1>Saya belajar web</h1>")
}).listen(3000)