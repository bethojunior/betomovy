class LogEvent {

    /**
     *
     * @param object
     * @param type
     * @param pathLog
     */
    static createLog(object,type,pathLog){
        let line =
            `${type};${new Date().toLocaleString()};${device.uuid},${device.platform};${device.model};${device.version};${device.manufacturer};`;

        line += JSON.stringify(object);

        line += "\n";

        this.openFile(pathLog,(file, fileEntry)=>{
            this.writeLog(file,fileEntry,line)
        });
    }

    static writeLog(file, fileEntry, text) {
        let reader = new FileReader();

        reader.onloadend = () => {
            fileEntry.createWriter((fileWriter) => {
                fileWriter.onwriteend = () => {
                    fileEntry.file((file) => {
                        reader.onloadend = ()=> {};
                        reader.readAsText(file);
                    },() => {});
                };

                fileWriter.seek(fileWriter.length);

                fileWriter.write(text);
            });
        };
        reader.readAsText(file);
    }

    static openFile(nameFile, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getFile(nameFile, {
                create: true,
                exclusive: false
            }, function (fileEntry) {
                fileEntry.file(function (file) {
                    callback(file, fileEntry);
                });
            });
        }, (error) => {
        });
    }

    /**
     *
     * @param dirMain {String}
     * @param subDirs {Array}
     */
    static createDirMain(dirMain,subDirs) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs)=> {
            fs.root.getDirectory(dirMain, {create: true},(dirRaizEntry) => {
                subDirs.map(dir=>{
                    dirRaizEntry.getDirectory(dir, {create: true},(dirEntry)=> {});
                })
            });
        });
    }
}

const TYPE_LOG_ACTION = 1;
const TYPE_LOG_REQUEST = 2;