function showCooperativeDriver() {
    const elementProperty = new ElementProperty();

    elementProperty.getElement(".container-image-cooperative", element => {
        element.style.backgroundImage = `url(${Session.get("imageCooperative")})`
    });
}

function downloadCooperative(cooperative) {
    return new Promise((resolve, reject) => {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
            const url = `${PATH_COOPERATIVE}${cooperative.idCooperative}/${cooperative.logo_image}`;
            // Parameters passed to getFile create a new file or return the file if it already exists.
            fs.root.getFile('cooperative.png', {create: true, exclusive: false}, function (fileEntry) {
                downloadImage(fileEntry, url, resolve, reject);
            }, reject);

        }, reject);
    })
}

function downloadImage(fileEntry, uri, success, error) {

    const fileTransfer = new FileTransfer();
    const fileURL = fileEntry.toURL();

    fileTransfer.download(
        uri,
        fileURL,
        success,
        error,
        null, // or, pass false
        {}
    );
}

function updateImageCooperative(userLogged){
    if(userLogged.cooperative === null || userLogged.cooperative === undefined)
        return;

    downloadCooperative(userLogged.cooperative).then((result)=>{
        Session.set("imageCooperative",result.nativeURL);
        showCooperativeDriver();
    });
}


if (!Array.isArray(Session.get("imageCooperative"))) {
    checkCooperativeDriver();
}

function checkCooperativeDriver(){
    const user = Session.get("user");

    if(user.cooperative === null || user.cooperative === undefined){
        Session.delete("imageCooperative");
        return;
    }

    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fileSystem) {
        fileSystem.root.getFile('cooperative.png',  {create: false}, () => {
            new ElementProperty().getElement(".container-image-cooperative", element => {
                element.style.backgroundImage = `url(${Session.get("imageCooperative")})`;
            });
        }, () => {
            updateImageCooperative(user);
        });
    }, () => {});
}