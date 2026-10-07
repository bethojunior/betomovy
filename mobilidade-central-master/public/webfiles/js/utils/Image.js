class ImageUpload {
    static  resize(file, width, height) {
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
                        data:ImageUpload
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
}