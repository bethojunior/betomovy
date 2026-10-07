class PreloadRequest{
    static progress(message){
        this.clear();
        this.setMessage(message,"active");
    }

    static success(message){
        this.setMessage(message,"success");

    }

    static info(message){
        this.setMessage(message,"info");

    }

    static setMessage(message,type){
        const elementProperty = new ElementProperty();

        this.clear();

        elementProperty.addClass(".preload-request",type);

        elementProperty.getElement(".text-preload",element=>{
            element.innerHTML = message;
        })
    }

    static clear(){
        const elementProperty = new ElementProperty();
        elementProperty.removeClass(".preload-request","active","success","info");
    }
}
