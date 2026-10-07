class TripRatingController {
    static rating(rating,tripReference, comment){
        return new Promise((resolve,reject) => {
            ConnectionServer.sendRequest('TripRating/Rate' , 'POST' ,
                {rating,tripReference, comment} , resolve,reject,false);
        })
    }
}