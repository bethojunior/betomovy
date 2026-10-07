class LocalStorage{

    static save(name,object){
        localStorage.setItem(name,JSON.stringify(object));
    }

    static get(name){
        const list = localStorage.getItem(name) === null ?
            [] : JSON.parse(localStorage.getItem(name));


        return list;
    }
}