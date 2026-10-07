class CustomerWaitTime{

    constructor() {
        this.eventObserver = ()=>{};
        this.callbackEndTime = ()=>{};
        this.timeout = null;
        this.dateFinal = new Date();
        this.dateStart = new Date();
        this.elementProperty = new ElementProperty();
        this.diff = 0;
        this.isActive = false;
    }

    setTimeDiff(time){
        this.diff = time;
    }

    start(init = true){

        if(this.isActive && init)
            return;

        clearTimeout(this.timeout);

        if(init){
            this.dateFinal = new Date(Session.get("customerWaitTime"));
            this.dateFinal.setSeconds(this.dateFinal.getSeconds() + this.diff);
            this.dateStart = new Date(Session.get("customerWaitTime"));
            this.elementProperty.addClass(".container-customer-wait-time","active");
            this.elementProperty.getElement("#progressCustomerWait",element=>{
                element.style.width = `0%`;
            });
            this.isActive = true;
        }

        const percent = this.calculatePercentTime();

        this.elementProperty.getElement("#progressCustomerWait",element=>{
            element.style.width = `${percent}%`;
        });

        this.eventObserver(percent);

        if(percent >= 100){
            this.callbackEndTime();
            return;
        }

        this.timeout = setTimeout(()=> this.start(false),1000);
    }

    calculatePercentTime(){
        const max = (this.dateFinal.getTime() - this.dateStart.getTime()) / 1000;

        const now =  (this.dateFinal.getTime() - new Date().getTime()) /1000;

        const result = 100 - ((now * 100) / max);

        return result < 100 ? result : 100;

    }


    addEventEndTime(callback){
        this.callbackEndTime = callback;
    }

    addEventObserver(callback){
        this.eventObserver = callback;
    }

    stop(){
        clearTimeout(this.timeout);
        this.elementProperty.removeClass(".container-customer-wait-time","active");
        this.elementProperty.getElement("#progressCustomerWait",element=>{
            element.style.width = `0%`;
        });
        Session.delete("customerWaitTime");
        this.isActive = false;
    }
}

const customerWaitTime = new CustomerWaitTime();