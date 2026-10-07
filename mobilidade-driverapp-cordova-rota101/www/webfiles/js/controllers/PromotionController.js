class PromotionController{

    static loadPromotions(){
        return new Promise(resolve => {
            ConnectionServer.sendRequestMilto('' , 'POST' , data , resolve , reject)
        })
    }

    static teste(callback){
        $.ajax({
            url: "https://betho1.000webhostapp.com/teste.json",
            success: function(data){
                callback(data);
            }
        })
    }

}
