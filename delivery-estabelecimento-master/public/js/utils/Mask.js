class Mask {

    static idUrl()
    {
        return new Promise(resolve => {
            let url = window.location.href;
            url = url.toString();
            let length = (url.split("/").length - 1);
            url = url.split("/");
            resolve(url[length]);
        })
    }

    /**
     *
     * @param duration
     * @returns {string[]}
     */
    static secondsToMinutes(duration)
    {
        let minutes   = (duration / 60);
        minutes = minutes.toString();
        return minutes.split('.');
    }

    static createCodeFavorite(nickname,idDriver) {
        const name = removeAcento(nickname).split("");
        const type = "P";
        const characters = name[0].toUpperCase()+name[name.length - 1].toUpperCase();
        const code = "00000" + idDriver;
        return characters+code.slice(-5)+type;
    }

    static setDate(date) {
        if(date != null){
            return date.toLocaleString()
        }
        return ""
    }

    static setDateCrazy(date_complete , return_hour = true) {
        let date = date_complete.substr('0',10);
        let hour = date_complete.substr('10','9');
        date = date.split('-');
        if(return_hour){
            return date[2]+'/'+date[1]+'/'+date[0]+'  '+hour;
        }
        return date[2]+'/'+date[1]+'/'+date[0];
    }

    static return_date(date_complete,what) {
        let date = date_complete.substr('0',10);
        let hour = date_complete.substr('10','9');
        date = date.split('-');
        if(what === 'hour'){
            return hour;
        }
        return date[2]+'/'+date[1]+'/'+date[0];

    }

    static setDateCrazyWhitOutHour(dateComplet) {
        let date = dateComplet.substr('0',10);
        let hour = dateComplet.substr('10','9');
        date = date.split('-');
        return date[1]+'/'+date[2]+'/'+date[0];
    }

    static returnHour(date) {
        date = date.substr(0, 16);
        let hora = date.substr(11, 16);
        date = date.substr(0, 11);
        date = date.split('-');
        return hora;
    }

    static setMaskPhone(name) {
        $(name).mask(function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        }, {
            onKeyPress: function (val, e, field, options) {
                field.mask(function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                }.apply({}, arguments), options);
            }
        });
    }

    static setMaskPhoneValue(val){
        const mask = val.replace(/\D/g, '').length === 11 ?
            val.replace(/\D/g, '').match(/(\d{2})(\d{4})(\d{4})/) :
            val.replace(/\D/g, '').match(/(\d{2})(\d{5})(\d{4})/);

        return `(${mask[1]}) ${mask[2]}-${mask[3]}`;
    }


    static digitsToTheLeft(amount, text) {
        return ("00" + text).slice(-amount);
    }

    /**
     *
     * @param value {float}
     * @returns {string}
     */
    static maskMoney(value) {
        let number = value.toFixed(4).split(".");

        number = parseFloat(`${number[0]}.${number[1].slice(0, 2)}`);

        number = number.toFixed(2).split('.');
        number[0] = number[0].split(/(?=(?:...)*$)/).join('.');
        return number.join(',');
    }

    /**
     *
     * @param nameElement {String}
     */
    static setMoneyField(nameElement,valueDefault= "100000") {
        elementProperty.getElement(nameElement, element => {
            element.type = 'tel';
            element.value = element.value.length > 0 ? element.value : '0,00';
            element.style.textAlign = 'right';
            element.setAttribute("max-value", valueDefault);
        });

        $(nameElement).maskMoney({prefix:'', allowNegative: false,allowZero:true, thousands:'.', decimal:',', affixesStay: false});
    }

    /**
     *
     * @param elementName {String}
     * @param value {number}
     */
    static setMaxValue(elementName, value) {
        const elementProperty = new ElementProperty();

        elementProperty.getElement(elementName, element => {
            element.setAttribute("max-value", value)
        })
    }

    /**
     * retorna o valor sem mascara
     * @param value {String}
     * @returns {number}
     */
    static removeMaskMoney(value) {
        return parseFloat(value.replace(/\./g, "").replace(/\,/g, "."));
    }

    static setCreditCard(nameElement) {
        const elementProperty = new ElementProperty();

        elementProperty.addEventInElement(nameElement, "onkeyup", function (event) {
            const value = this.value.replace(/[^\w\s]/gi, "").replace(/ /g, '').split("");

            const typeCard = Mask.getTypeMaskCrediCard(value.join(""));

            let newValue = "";

            if (event.keyCode === 8) {
                let mask = "";
                let parts = this.value.split(" ");

                parts.map((part, index) => {
                    mask += part;
                    if (index + 1 < parts.length - 1 || parts[index + 1])
                        mask += " ";
                });

                this.value = mask;
                return;
            }

            if (value.length > typeCard.type.chars - 1)
                value.splice(typeCard.type.chars, value.length - typeCard.type.chars);

            value.map((number, index) => {
                newValue += number;

                if (typeCard.type.spaceIn.includes(index))
                    newValue += " ";
            });

            this.value = newValue;
        });
    }

    static getTypeMaskCrediCard(number) {
        let result = {
            status: false,
            type: {
                spaceIn: [3, 7, 11],
                chars: 16
            }
        };

        const types = {
            visa: {
                regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
                spaceIn: [3, 7, 11],
                chars: 16
            },
            mastercard: {
                regex: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
                spaceIn: [3, 7, 11],
                chars: 16
            },
            amex: {
                regex: /^3[47][0-9]{13}$/,
                spaceIn: [3, 9],
                chars: 15
            },
        };

        for (let key in types) {
            if (types[key].regex.test(number)) {
                result.status = true;
                result.type = types[key];
                break;
            }
        }

        return result;
    }

    static setMonthYear(nameElement) {
        const elementProperty = new ElementProperty();

        elementProperty.addEventInElement(nameElement, "onkeyup", function (event) {
            let value = this.value;

            const data = value.split("/");

            if (data.length === 1) {
                const month = data[0].replace(/[^\w\s]/gi, "");

                if (event.keyCode === 8) {
                    this.value = month.substring(0, month.length - 1);
                    return;
                }

                const auxDigit = (month.length > 1) ? "" : "0";

                if (parseInt(month + auxDigit) > 12) {
                    this.value = month.length === 2 ?
                        month.substring(0, month.length - 1) : `0${month}/`;
                    return;
                }

                if (parseInt(month) <= 12) {
                    this.value = month.length > 1 ? `${month}/` : `${month}`;
                    return;
                }

                this.value = month.substring(0, month.length - 1);

                return;

            }

            if (data.length === 2) {
                const year = data[1].replace(/[^\w\s]/gi, "");

                this.value = data[0] + "/";

                if (year.length > 2) {
                    this.value += year.substring(0, year.length - 1);
                    return;
                }


                if (event.keyCode === 8) {
                    this.value += year;
                    return;
                }

                const auxDigit = (year.length > 1) ? "" : "0";

                if (parseInt(year + auxDigit) > 99) {
                    this.value += year.length === 2 ?
                        year.substring(0, year.length - 1) : `${year}`;
                    return;
                }

                if (parseInt(year) <= 99) {
                    this.value += year.length > 1 ? `${year}` : `${year}`;
                    return;
                }

                this.value += year.substring(0, year.length - 1);

            }

        });
    }

    static maskPhone(number) {
        let res = number.replace("(", "");
        res = res.replace(")", "");
        res = res.replace(" ", "");
        res = res.replace("-", "");
        return res;
    }

    static setMaskCpf(name) {
        $(name).mask('000.000.000-00', {reverse: true});
    }

    static whats(number) {
        if(number === null || number === undefined || number === '' || number === false)
            return '';
        let res = number.replace("(", "");
        res = res.replace(")", "");
        res = res.replace(" ", "");
        res = res.replace("-", "");
        return res;
    }

    static isNull(field)
    {
        if(field === null || field === '' || field === undefined)
            return 'Não informado';

        return field;
    }

    static isNullBoolean(field){
        if(field === null || field === '' || field === undefined)
            return false;

        return true;
    }
}
