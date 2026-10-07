class IconMapController extends ConnectionServer {

    static listIcon() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('iconMapDriver',"GET", null, resolve, reject, true);
        });
    }

    static createIcon(data) {
        const formData = new FormData();
        formData.append("icon", data.icon)
        return  ConnectionServer.sendRequestWithFiles('iconMapDriver', 'POST', formData, true);
    }

    static removeIcon(id){
        return new Promise((resolve) => {
           ConnectionServer.sendRequest( `iconMapDriver/${id}`,'DELETE', null, resolve, undefined, true);
        });
    }

}