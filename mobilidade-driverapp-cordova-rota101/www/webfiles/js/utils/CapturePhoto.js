class CapturePhoto {
    constructor(){
        this.options = {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            targetHeight: 1200,
            targetWidth: 1600,
            correctOrientation: true
        };
    }

    get(type = Camera.PictureSourceType.CAMERA){
        this.options.sourceType = type;

        if(type !== Camera.PictureSourceType.CAMERA) {
            return new Promise((resolve, reject) => {
                //window.plugin.backgroundMode.enable();
                navigator.camera.getPicture((result) => {
                    FileUpload.getFile(result).then(file => {
                        resolve(file)
                    });
                },reject, this.options);
            });
        }

        return new Promise((resolve) => {
            //window.plugin.backgroundMode.enable();
            navigator.device.capture.captureImage((result) => {
                FileUpload.getFile(result[0].fullPath).then(file => {
                    resolve(file)
                });
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            },);
        });
    }
}
