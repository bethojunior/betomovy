class Controller {
    static pathUrl() {
        return new Promise(resolve => {
            let url = window.location.href;
            url = url.toString();
            let length = (url.split("/").length - 1);
            resolve(url.split("/"));
        })
    }
}