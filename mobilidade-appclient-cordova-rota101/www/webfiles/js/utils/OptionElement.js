function preload(status){
    if(status){
        document.getElementById("preloader").style.display = "block";
        return;
    }
    document.getElementById("preloader").style.display = "none";
}

function displayElement(name, estilo) {
    
    const option = name.substring(0, 1);

    name = name.substring(1, name.length);

    switch (option) {
        case "#" : {
            document.getElementById(name).style.display = estilo;
            break;
        }

        case "." : {
            document.getElementsByClassName(name).style.display = estilo;
            break;
        }
    }

}