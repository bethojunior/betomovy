class Handle {
    static handleEnter(event) {
        return new Promise(resolve => {
            if(event.keyCode === 13) {
                resolve(event)
            }
        })
    }
}