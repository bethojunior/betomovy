class Progress{
    constructor(){
        this.ids = [];
        this.timeout = undefined;
        this.object = {};
        this.callback = null;
    }

    /**
     *
     * @param timeInSeconds
     * @param callback
     */
    progressTime(timeInSeconds,callback){
        let _that = this;
        const object = {
            finishProgres  : false,
            dateStart :  new Date(),
            lastDate : new Date(),
            newDate : null,
            finishDate : new Date(),
            progress: 0,
            timeout : null,
            timeSpent: ''
        };

        object.finishDate.setSeconds(object.finishDate.getSeconds() + timeInSeconds);

        _that.timeout = new Worker(HOST+"webfiles/js/worker/progress.js");

        _that.timeout.onmessage = function () {
            object.lastDate = new Date();

            let diff = object.lastDate.getTime() - object.dateStart.getTime();

            object.timeSpent = _that.timeDiff(diff);

            object.percent = (diff * 100) / (timeInSeconds * 1000);

            object.newDate =  new Date();

            object.newDate.setTime(timeInSeconds * 1000 - diff);

            if (object.lastDate.getTime()  >= object.finishDate.getTime()) {
                object.finishProgres = true;
                object.percent = 100;
                callback(object);
                _that.stopProgress();
                return;
            }
            callback(object);
        }
    }


    /**
     *  Conta em um tempo indefinido
     * @param callback
     * @param date
     */
    progressUndefined(callback,date = null){
        let _that = this;

        if(date !== null){
            date = new Date(date);
        }

        if(date === null) {
            date = new Date(DateCustom.getNow());
            Session.set("dateInitTrip",DateCustom.getNow());
        }
        this.object = {
            dateStart :  date,
            dateEnd : new Date(),
            seconds: 0,
            timeSpent: ''
        };

        this.callback = callback;

       /* _that.timeout = new Worker(HOST+"webfiles/js/worker/progress.js");

        _that.timeout.onmessage = function() {

            object.dateEnd = new Date(DateCustom.getNow());

            let diff = object.dateEnd.getTime() - object.dateStart.getTime();

            object.seconds = diff/1000;

            object.timeSpent = _that.timeDiff(diff);

            callback(object);
        }*/

        this.timeout = this.executeProgress();
    }

    executeProgress(){

        this.object.dateEnd = new Date();

        let diff = this.object.dateEnd.getTime() - this.object.dateStart.getTime();

        this.object.seconds = diff/1000;

        this.object.timeSpent = this.timeDiff(diff);

        this.callback(this.object);

        return setTimeout(()=>{
            this.timeout = this.executeProgress();
        },1000);
    }

    /**
     * Para o progresso
     */
    stopProgress(){
       /* if(this.timeout === undefined){
            return;
        }
        this.timeout.terminate();
        this.timeout = undefined;*/
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }


    /**
     *
     * @param percent
     */
    setProgress(percent) {

        if(document.querySelector('circle') !== null) {

            let circle = document.querySelector('circle');

            if(!isMobile()) {
                circle.setAttribute('r','10.3vw')
            }

            let radius = circle.r.baseVal.value;
            let circumference = radius * 2 * Math.PI;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;

            circle.style.strokeDashoffset = circumference - percent / 100 * circumference;
        }

    }

    timeDiff(diff){

        diff = diff/1000;

        const minutes = parseInt(diff/60);
        const seconds = parseInt(diff%60);

        return `${Mask.digitsToTheLeft(2,minutes)}:${Mask.digitsToTheLeft(2,seconds)}`;
    }
}