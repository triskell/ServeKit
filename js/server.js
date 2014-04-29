var http = require('http');
var server = false;
var port = 0;
var index = 'index.html';

function initServer(){
    var fs = require('fs');
    var url = require('url');
    
    server = http.createServer(function(request, response) {
    
        var uri = url.parse(request.url).pathname;
        var filename = './links' + uri;
        
        fs.exists(filename, function(exists) {
            if(!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }
        
            if (fs.statSync(filename).isDirectory()) filename += index;
        
            fs.readFile(filename, "binary", function(err, file) {
                if(err) {        
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }
        
            response.writeHead(200);
            response.write(file, "binary");
            response.end();
            });
        });
    });
}

function startServer(port){
    console.log('Trying start server on port ' + port+ ' ...');
    if(!server) window.setTimeout(startServer,500);
    else{
      server.listen(port, function(err){
          if(err)console.log('Error while staring server : ' + err);
          else console.log('Server started on port ' + port);
      });
    } 
}

function restartServer(port){
    if(server) server.close(function(err){
        if(err)console.log(err);
        server = false;
        initServer();
        startServer(port);
    });
}

function stopServer(){
    if(server) server.close(function(err){
        if(err) console.log(err);
        server = false;
    });
}

/*window.onbeforeunload = function (e) {
    if(server) server.close();
};*/

function loadConfiguration(callback){
    var fs = require('fs');
    var file = './config.json';
     
    fs.readFile(file, 'utf8', callback);
}

initServer();
loadConfiguration(function(err, data){
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    data = JSON.parse(data);
     
    port  = data.port;
    startServer(port);
    displayPort(port);
});