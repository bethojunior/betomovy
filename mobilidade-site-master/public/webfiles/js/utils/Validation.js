class Validation{
    static checkObjectFilled(object){
        let result = true;
        Object.keys(object).map(param => {
            const params = Object.keys(object[param]);
            if(params.length > 0){
                params.map(item=>{
                    if(object[param][item] === ""){
                        result = false;
                    }
                });
            }else if(object[param] === ""){
                result = false;
            }
        });

        return result;
    }
}
