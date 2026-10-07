class FileUpload {
    /**
     *
     * @param path {String}
     * @returns {Promise<any>}
     */

    static getFile(path) {
        return new Promise((resolve, reject) => {            
            if (device.platform === "iOS" && path.startsWith("file://")) {
                path = path.replace("file://", "");
            }
    
            if(device.platform === "iOS") {
                path = cordova.file.tempDirectory + path.split('/').pop();
            }
    
            window.resolveLocalFileSystemURL(path, function (fileEntry) {
                fileEntry.file((file) => {
                    if(device.platform === "iOS") {
                        file.localToURL = window.WkWebView.convertFilePath(fileEntry.toURL());
                    } else {
                        file.localToURL = fileEntry.toURL();
                    }
                    resolve(file);
                }, (e) => {
                    console.log('error getting file', e);
                    reject(e);
                });
            }, (e) => {
                console.log('Error resolving fs url', JSON.stringify(e));
                reject(e);
            });
        });
    }   

    static getFileAudio(path) {
        return new Promise((resolve) => {
            if(device.platform === "iOS"){
                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, (fs) => {
                    fs.root.getFile(path,{create:false}, (fileEntry)=>{
                        fileEntry.file((file)=>{
                            resolve(file);
                        })
                    })              
                });
                return;
            }

            window.resolveLocalFileSystemURL(path, function (fileEntry) {
                fileEntry.file((file)=> {
                    resolve(file);
                }, (e)=> {
                    console.log('error getting file', e);
                });
            },(e)=> {
                console.log('Error resolving fs url', e);
            });
        });
    }

    static async prepareAudio(file){
        return await new Promise(resolve => {
            let reader = new FileReader();
            reader.onloadend = (fileReadResult) => {
                let data = new Uint8Array(fileReadResult.target.result);
                resolve({data : new Blob([data],{type: file.type}), name : file.name});
            };
            reader.readAsArrayBuffer(file)
        });
    }

    static async prepare(file){
        return FileUpload.resize(file, 500,500);
    }

    static resize(file, width, height) {
        return new Promise((resolve) => {

            const reader = new FileReader();
            reader.onloadend = function () {

                const tempImg = new Image();
                tempImg.src = reader.result;
                tempImg.onload = function() {

                    const MAX_WIDTH = width;
                    const MAX_HEIGHT = height;
                    let tempW = tempImg.width;
                    let tempH = tempImg.height;
                    if (tempW > tempH) {
                        if (tempW > MAX_WIDTH) {
                            tempH *= MAX_WIDTH / tempW;
                            tempW = MAX_WIDTH;
                        }
                    } else {
                        if (tempH > MAX_HEIGHT) {
                            tempW *= MAX_HEIGHT / tempH;
                            tempH = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = tempW;
                    canvas.height = tempH;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, tempW, tempH);
                    const dataURL = canvas.toDataURL(file.type);

                    resolve({
                        data:FileUpload
                            .b64toBlob(dataURL
                                .replace(`data:${file.type};base64,`, ''), file.type),
                        name: file.name
                    });
                }

            };
            reader.readAsDataURL(file);
        });
    }

    static b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    static createFile(nameFile){
        return new Promise(resolve => {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                fs.root.getDirectory(nameFile, {create: true}, resolve);
            });
        });
    }
}