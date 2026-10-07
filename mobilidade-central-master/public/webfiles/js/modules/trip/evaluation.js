class Evaluation {
    constructor(trip) {
        this.elementProperty = new ElementProperty();
        this.rating = 0;
        this.trip = trip;
    }

    show(callback) {

        this.elementProperty
            .getElement(".modal-evaluation", element => element.classList.add("active"));

        this.elementProperty.addEventInElement(".close-evaluation","onclick",()=>{
            this.hidden();
        });

        this.elementProperty.addEventInElement(".rating-trip", "onclick", ({srcElement:element})=> {
            this.rating = parseInt(element.getAttribute("value"));

            this.elementProperty.getElement(".rating-trip", element => {
                if (parseInt(element.getAttribute("value")) <= this.rating){
                    element.classList.add("active");
                    return;
                }
                element.classList.remove("active");
            });
        });

        this.elementProperty.addEventInElement("#confirmationRatingTrip","onclick",()=>{
            if(this.rating === 0){
                SwalCustom.messageDialog("Informe uma avaliação","Atenção",undefined,"info");
                return;
            }
            callback(this.rating,this.trip);
        });
    }

    hidden() {
        this.elementProperty
            .getElement(".modal-evaluation", element => element.classList.remove("active"));
        this.elementProperty
            .getElement(".rating-trip", element => element.classList.remove("active"));
    }
}