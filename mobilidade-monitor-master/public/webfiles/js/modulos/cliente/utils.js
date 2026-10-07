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