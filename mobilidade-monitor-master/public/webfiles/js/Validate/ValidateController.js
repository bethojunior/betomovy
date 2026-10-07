class ValidateController {

    /**
     *
     * @param data
     * @returns {boolean}
     */
    static validateFields(data)
    {
        for(let i in data){
            if(document.getElementById(data[i]).value === null || document.getElementById(data[i]).value === '' || document.getElementById(data[i]).value === ' ')
                return false;
            return true;
        }
    }

    /**
     *
     * @param content
     */
    static addParameters(content)
    {
        let data = {};
        content.map(item => {
            data[item] = document.getElementById(item).value;
        });

        return data;
    }

    /**
     *
     * @param content
     */
    static addParametersIsNull(content)
    {
        let data = {};
        content.map(item => {
            if(document.getElementById(item) === null || document.getElementById(item) === undefined)
                return false;

            if(document.getElementById(item).value === '' || document.getElementById(item).value === null || document.getElementById(item).value === undefined){
                data[item] = '';
            }else{
                data[item] = document.getElementById(item).value;
            }
        });

        return data;
    }

}
