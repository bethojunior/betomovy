class PathUrl {
    
    static getPathUrl() {
        
        let url    = window.location.href
        url        = url.toString()
        let length = (url.split("/").length - 1)
        url        = url.split("/")
        let path   = url[length - 1] + '/' + url[length] 
    
        return path
    }

    static getLastUrl() {
        let url    = window.location.href
        url        = url.toString()
        let length = (url.split("/").length - 1)
        url        = url.split("/")
        let path   = url[length]
    
        return path
    }
}