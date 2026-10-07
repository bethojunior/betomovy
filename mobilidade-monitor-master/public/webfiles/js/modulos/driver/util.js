function createCodeFavorite(nickname , userTypeId ,idDriver) {
    const name = removeAcento(nickname).split("");

    const type = userTypeId === "7" ? "P" : "T";

    return `${name[0].toUpperCase()}${name[name.length - 1].toUpperCase()}${("00000" + idDriver).slice(-5)}${type}`;
}

function removeAcento(text) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
}

function checkStatusColor(color){
    let status = "red";
    if(color === "ATIVO"){
        status = "green";
    }
    return status;
}

function checkStatus(status) {
    if(status === "ATIVO")
        return true;

    return false;
}

function getIdByUrl() {
    let url = window.location.href;
    url = url.toString();
    let length = (url.split("/").length - 1);
    url = url.split("/");
    let path =  url[length - 1] + '/' + url[length];
    path = path.split("?");
    path = path[0];
    return path.substr(5);

}

function getByUrl(position = 0 , after = 0 , before = 0) {
    let url = window.location.href;
    url = url.toString();
    let length = (url.split("/").length - 1);
    url = url.split("/");
    let path =  url[length - 1] + '/' + url[length];
    path = path.split("?");
    path = path[position];
    return path.substr(after , before);

}

function checkIfTripIsCanceled(trip) {
    if(trip === "customer"){
        return 'Cancelada pelo usuário';
    }
    if(trip === 'driver'){
        return 'Cancelada pelo motorista';
    }
    return 'Finalizada';
}