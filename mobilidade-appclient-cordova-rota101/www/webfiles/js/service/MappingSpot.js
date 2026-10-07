class Mapping{

    static initContainer(nameContainer , valueSpot){
        Storaged.set(nameContainer , valueSpot);
    }

    static setSpot(container , name , value){
        Storaged.setAttribute(container , name , value);
    }

    static getSpot(container){
        return Storaged.get(container);
    }

}