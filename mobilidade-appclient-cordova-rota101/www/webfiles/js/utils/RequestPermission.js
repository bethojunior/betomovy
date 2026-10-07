class RequestPermission{
    static requestAudio(){
        const src = (device.platform === "iOS") ? 
            (new Date().getTime()) + '.wav' :
            cordova.file.externalRootDirectory + (new Date().getTime()) + '.mp3';


        const media = new Media(src);
        media.startRecord();
        media.stopRecord();
        media.play();
        media.stop();
        media.release();
    }

}