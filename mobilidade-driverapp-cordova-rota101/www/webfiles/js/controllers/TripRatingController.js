class TripRatingController{
    static rating(rating,tripReference){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest('TripRating/Rate' , 'POST' ,
                {rating,tripReference} , resolve,reject,undefined,false);
        })
    }
}