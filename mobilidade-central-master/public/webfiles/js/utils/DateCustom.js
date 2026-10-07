class DateCustom{
    static SUNDAY(){
        return 0;
    }
    static FRIDAY(){
        return 5;
    }
    static SATURDAY(){
        return 6;
    }

    static getNow(){
        const date = new Date();

        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`+
            `T${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}:${Mask.digitsToTheLeft(2,date.getSeconds())}`;
    }

    static getDateLocal(dateDefined){
        const date = new Date(dateDefined.replace(' ', 'T'));
        return `${Mask.digitsToTheLeft(2,date.getDate())}/${Mask.digitsToTheLeft(2,date.getMonth() + 1)}/${date.getFullYear()}`+
            ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}`;
    }

    static getMinuteBySecunds(secunds){
        return Math.floor(secunds/60)
    }

    /**
     * Retorna o tempo
     * @param dateCustom
     * @returns {string}
     */
    static getTimeNow(dateCustom = false){

        const date = !dateCustom ? new Date() : new Date(dateCustom.replace(' ', 'T'));

        return ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}`;
    }

    static getDiff(dateStart,dateEnd){
        const objectDateStart = new Date(dateStart.replace(' ', 'T'));
        const objectDateEnd = new Date(dateEnd.replace(' ', 'T'));

        return parseInt((objectDateEnd.getTime() - objectDateStart.getTime())/1000/60);
    }

    static dateToYMD(date) {
        const d = date.getDate();
        const m = date.getMonth() + 1; //Month from 0 to 11
        const y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    /**
     * retorna a data formatada  no formator americano
     * @returns {string}
     */
    static getDate(){
        const date = new Date();

        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`;
    }

    /**
     * Retorna a data menos algum dias
     * @param days
     * @returns {string}
     */
    static getDateLessDays(days){
        const date = new Date();

        date.setDate(date.getDate() - days);

        return `${date.getFullYear()}-${Mask.digitsToTheLeft(2,date.getMonth() + 1)}-${Mask.digitsToTheLeft(2,date.getDate())}`;
    }

    /**
     *
     * @param dateStart
     * @param dateEnd
     * @returns {*}
     */
    static compareDateStartAndDateEnd(dateStart,dateEnd){
        if(dateStart.length === 0 || dateEnd.length === 0)
            return {status:false,message: "Data não informada"};

        return {status: dateStart <= dateEnd, message: "Data inicial não pode ser maior que a data final"};
    }


    static compareAmountDays(dateStart,dateEnd){
        dateStart = new Date(dateStart);
        dateEnd = new Date(dateEnd);

        const timeDiff = Math.abs(dateEnd.getTime() - dateStart.getTime());

        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    /**
     * Retorna data util
     * @returns {Date}
     */
    static getBusinessDay(){
        const date = new Date();

        const weekDay = date.getDay();

        switch (weekDay) {
            case DateCustom.SUNDAY(): {
                date.setDate(date.getDate() + 1);
                break;
            }
            case DateCustom.SATURDAY(): {
                date.setDate(date.getDate() + 2);
                break;
            }
            case DateCustom.FRIDAY(): {
                date.setDate(date.getDate() + 3);
                break;
            }
        }

        return date;

    }

    /**
     * retorna a data formatada  no formator br
     * @param date
     * @returns {string}
     */
    static formatDate(date){

        return `${Mask.digitsToTheLeft(2,date.getDate())}/${Mask.digitsToTheLeft(2,date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    /**
     * retorna a data e tempo formatada  no formator br
     * @returns {string}
     */
    static formatDateTime(){
        const date = new Date();
        return `${Mask.digitsToTheLeft(2,date.getDate())}/${Mask.digitsToTheLeft(2,date.getMonth() + 1)}/${date.getFullYear()}`+
            ` ${Mask.digitsToTheLeft(2,date.getHours())}:${Mask.digitsToTheLeft(2,date.getMinutes())}`;
    }
}