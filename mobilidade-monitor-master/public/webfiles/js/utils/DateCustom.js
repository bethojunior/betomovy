class DateCustom{
    static getNow(){
        const date = new Date();

        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`+
            ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}:${Mask.digitsToTheLeft(2,date.getSeconds())}`;
    }

    static getTimeNow(dateCustom = false){

        const date = !dateCustom ? new Date() : new Date(dateCustom);

        return ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}`;
    }

    static getTime(date){
        const dateStart = new Date(date);
        const dateNow = new Date();

        return new Progress().timeDiff(dateNow.getTime() - dateStart.getTime());
    }

    static getDateEua(data){
        const date = new Date(data);

        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`+
            ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}:${Mask.digitsToTheLeft(2,date.getSeconds())}`;
    }

    static getDateTimeInput(date){
        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`+
            `T${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}:${Mask.digitsToTheLeft(2,date.getSeconds())}`;
    }
    
    
}