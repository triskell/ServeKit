window.ondragover = function(e){
    e.preventDefault();
    return false;
};

window.ondrop = function(e){
    e.preventDefault();
    return false;
};

var portLabel = document.querySelector('#port');
function displayPort(port){
    portLabel.innerHTML = port;
}

var drop = document.querySelector('#drop');

drop.ondragover = function(e){
    this.className = 'dragover';
    this.innerHTML = 'Drop here';
    return false;
};
drop.ondragleave = function(e){
    this.className = '';
    this.innerHTML = 'Drag your files here';
    return false;
};
drop.ondrop = function(e){
    e.preventDefault();
    for(var i=0 ; i<e.dataTransfer.files.length; ++i){
        var file = e.dataTransfer.files[i].path;
        copyToServer(file);
    }
    return false;
};

var setup = document.querySelector('#setup');
setup.onclick = function(){
    /*if(this.className == 'check'){
        port = document.querySelector('#portValue').value;
        
        startServer(port);
        displayPort(port)
        this.innerHTML = '<i class="fa fa-gear"></i>';
        this.className = '';
    }
    else{
        document.querySelector('#port').innerHTML = '<input id="portValue" type="number" number="6" value="' + port + '"/>';
        this.innerHTML = '<i class="fa fa-check"></i>';
        this.className = 'check';
    }*/
    console.log('Disabled. To change port use JSON configuration file and restart ServeKit.');
}


/*setup.onclick = function(){
    var fs = require('fs');
    fs.readFile('setup.html', function (err, data) {
      if (err) throw err;
      document.querySelector('body').innerHTML += data;
      onSetupLoaded();
    });
}*/

function setRemoveListeners(){
    var del = document.querySelectorAll('.remove');
    for(var i=0 ; i<del.length ; i++){
        del[i].onclick = function(){
            removeLink(this.getAttribute("data-file"));
        };
    }
}

function removeLink(name){
    var fs = require('fs');
    fs.unlink('./links/'+name, function(){
        loadLinks();
    });
}

function setIndexListeners(){
    var ind = document.querySelectorAll('.index');
    for(var i=0 ; i<ind.length ; i++){
        ind[i].onclick = function(){
            indexLink(this.getAttribute("data-file"), this);
        };
        if(ind[i].getAttribute("data-file") == index){
            ind[i].className = 'index home';
        }
    }
}

function indexLink(name, el){
    index = name;
    console.log('index to ' + index);
    if(document.querySelector('.home'))document.querySelector('.home').className = 'index';
    el.className = 'index home';
}



function copyToServer(file){
    var fs = require("fs");
    var path = require('path');
    
    var name = path.basename(file);
    
    fs.lstat(file, function(err, stats) {
        if (!err && stats.isFile()) {
            fs.symlink(file, './links/'+name, 'file', linkAdded);
        }
        else if (!err && stats.isDirectory()){
            fs.symlink(file, './links/'+name, 'dir', linkAdded);
        }
        else{
            if(err) console.log('Error : ' + err);
            console.log('Maybe this file ('+ file +') isn\'t a file or a directory');
        }
    });
}

function linkAdded(err){
    if(err) console.log(err);
    loadLinks();
    setRemoveListeners();
    setIndexListeners();
    
    drop.className = '';
    drop.innerHTML = 'Drag your files here';
}

function loadLinks(){
    var fs = require('fs');
    fs.readdir('./links/', function (err, files) {
        if (err) console.log(err);
      
        var links = document.querySelector("#links");
        links.innerHTML = ''; //Reset list
        
        files.forEach( function (file) {
            fs.lstat('./links/'+file, function(err, stats) {
                if (!err) {
                    var remove = '<a class="remove" href="#" data-file="'+file+'" title="Remove"><i class="fa fa-times"></i></a>'
                    var home = '<a class="index" href="#" data-file="'+file+'" title="Set as index"><i class="fa fa-home"></i></a>'
                    var actions = '<span class="actions">'+home+remove+'</span>';
                    links.innerHTML = links.innerHTML + '<li class="link">'+file+actions+'</li>';
                
                    setRemoveListeners();
                    setIndexListeners();
                }
                else{
                    console.log('Error : ' + err);
                }
            });
        });
    
    });
}

document.querySelector('body').onload = function(){
    loadLinks();
};