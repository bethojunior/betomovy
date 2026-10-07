class Mask {

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


    static digitsToTheLeft(amount, text) {
        return ("00" + text).slice(-amount);
    }

    /**
     *
     * @param value {Number}
     * @returns {string}
     */
    static maskMoney(value) {
        let isNegative = false;
        if (value < 0) {
            value = value * -1;
            isNegative = true;
        }

        let number = value.toFixed(4).split(".");

        number = parseFloat(`${number[0]}.${number[1].slice(0, 2)}`);

        number = number.toFixed(2).split('.');
        number[0] = number[0].split(/(?=(?:...)*$)/).join('.');

        if(isNegative)
            return `-${number.join(',')}`;

        return number.join(',');
    }

    static setMaskCpf(name) {
        $(name).mask('000.000.000-00', {reverse: true});
    }

    static setMaskCep(name) {
        $(name).mask('00000-000', {reverse: true});
    }

    static setMaskDateBirthday(name) {
        $(name).mask('00/00/0000', {reverse: true});
    }

    static replaceMaskDateUSToPT(date) {
        try {
            if(!date || date.length === 0) return date;
            const dateSplit = date.split('-');
            const final = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
            return final;
        } catch (e) {
            return date;
        }
    }

    static replaceDateBirth (date) {
        try {
            if(!date || date.length === 0) return date;
            const dateSplit = date.split('/')
            const final = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0]
            return final;
        } catch (e) {
            return date;
        }
    }

    /**
     *
     * @param nameElement {String}
     */
    static setMoneyField(nameElement) {
        const elementProperty = new ElementProperty();

        elementProperty.getElement(nameElement, element => {
            element.type = 'tel';
            element.value = '0,00';
            element.setAttribute("max-value", "100000");
        });

        elementProperty.addEventInElement(nameElement, "onclick", function () {
            this.selectionStart = this.selectionEnd = this.value.toString().length;
        });

        elementProperty.addEventInElement(nameElement, "onkeyup", function (event) {

            const maxValue = parseFloat(this.getAttribute("max-value"));

            const valueText = this.value.replace(/\./g, "").replace(/\,/g, ".");

            let digit = 10;

            if (!valueText.includes(".")) {
                digit = 0.01;
            }
            if (event.keyCode === 8) {
                digit = 0.1;
            }
            /*if ([13, 229].includes(event.keyCode)) {
            digit = 1;
        }*/
            const newValue = parseFloat(valueText) * digit;

            const value = newValue > maxValue ? maxValue : newValue;

            if (isNaN(value))
                return;

            const valueInArray = value.toFixed(2).toString().replace(/\./g, ",").split(",");

            const valueRest = valueInArray[1];

            const valueInteger = valueInArray[0];

            let newValueFormat = "";

            valueInteger.split("").reverse().map((number, index) => {
                if (index !== 0 && index % 3 === 0) {
                    newValueFormat = "." + newValueFormat;
                }

                newValueFormat = number + newValueFormat;
            });

            newValueFormat = newValueFormat + "," + valueRest;

            this.value = newValueFormat;

        });
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

    static removeMaskPhone(phone) {
        return phone.replace(/[^0-9]+/g,'');
    }

    static readPhoneMask(phone) {
        const value = phone.length == 11 ? 
        phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") :
        phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")

        return value;
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


    static setCreditCard(nameElement) {
        const elementProperty = new ElementProperty();

        elementProperty.addEventInElement(nameElement, "onkeyup", function (event) {
            const value = this.value.replace(/[^\w\s]/gi, "").replace(/ /g, '').split("");

            const typeCard = Mask.getTypeMaskCreditCard(value.join(""));

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


    static getTypeMaskCreditCard(number) {
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

}
