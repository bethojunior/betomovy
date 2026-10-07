class Evaluation {
    constructor(trip) {
        this.elementProperty = new ElementProperty();
        this.rating = 5;
        this.trip = trip;
        this.comment = null;
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
            this.comment = document.querySelector('.comment').value;

            callback(this.rating,this.trip,this.comment);
            document.querySelector('.comment').value = "";
        });
    }

    hidden() {
        this.elementProperty
            .getElement(".modal-evaluation", element => element.classList.remove("active"));
        this.elementProperty
            .getElement(".rating-trip", element => element.classList.remove("active"));
    }
}