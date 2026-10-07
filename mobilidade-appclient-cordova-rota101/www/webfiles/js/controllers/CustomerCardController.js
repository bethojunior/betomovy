class CustomerCardController{
    insert(card){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("CustomerCard/Insert" , "POST",
                card,resolve,reject,false);
        });
    }

    get(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("CustomerCard/Get" , "POST",
                {},resolve,reject,false);
        });
    }

    remove(cardId){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("CustomerCard/Delete" , "POST",
                {cardId},resolve,reject,false);
        });
    }

    verifyAcquirer(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("/CustomerCard/Acquirer" , "GET", null,resolve,reject,false);
        });
    }
}