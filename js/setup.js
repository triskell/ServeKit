function closeSetup(){
    console.log('toto ici');
    document.querySelector('#setup').remove();
}

function onSetupLoaded(){
    document.querySelector('#cancel').onclick = function(){
        closeSetup();
    }
    document.querySelector('#confirm').onclick = function(){
        closeSetup();
    }
}

