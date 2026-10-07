class Mask {

    static setDate(date) {
        if(date != null){
            return date.toLocaleString()    
        }
        return ""          
    }

    static setMaskCpf(cpf, useMask = true) {
        if (!useMask) {
            return cpf;
        }
        $(cpf).mask('000.000.000-00', {reverse: true});
    }

    static removeMask(name) {
        $(name).unmask();
    }

    static setMaskCnpj(name, useMask = true) {
        if (!useMask) {
            return name;
        }
        $(name).mask('00.000.000/0000-00', {reverse: true});
    }

    static setMaskCnpjOrCpf(document) {
        if (!document) return '';
        const mask = document.replace(/\D/g, '').length === 14 ?
            document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") :
            document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        return mask;
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

    static setMaskPhoneValue(val) {
        if (!val) return '';
        const digits = String(val).replace(/\D/g, '');
        if (digits.length === 11) {
            const match = digits.match(/(\d{2})(\d{5})(\d{4})/);
            return match ? `(${match[1]}) ${match[2]}-${match[3]}` : val;
        }
        if (digits.length === 10) {
            const match = digits.match(/(\d{2})(\d{4})(\d{4})/);
            return match ? `(${match[1]}) ${match[2]}-${match[3]}` : val;
        }
        return val;
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
        const elementProperty = new ElementProperty();

        elementProperty.getElement(nameElement, element => {
            element.type = 'tel';
            element.value = element.value.length > 0 ? element.value : '0,00';
            element.style.textAlign = 'right';
            element.setAttribute("max-value", valueDefault);
        });

        $(nameElement).maskMoney({prefix:'', allowNegative: true,allowZero:true, thousands:'.', decimal:',', affixesStay: false});


        /*const elementProperty = new ElementProperty();

        elementProperty.getElement(nameElement, element => {
            element.type = 'tel';
            element.value = element.value.length > 0 ? element.value : '0,00';
            element.style.textAlign = 'right';
            element.setAttribute("max-value", valueDefault);
        });

        elementProperty.addEventInElement(nameElement, "onclick", function () {
            this.selectionStart = this.selectionEnd = this.value.toString().length;
        });

        elementProperty.addEventInElement(nameElement, "onkeypress", function (event) {
            const removeLastNumber = "Backspace";

            const isNumber = /^[0-9]$/i.test(event.key);

            if (!isNumber && event.key !== removeLastNumber)
                return false;
        });

        elementProperty.addEventInElement(nameElement, "onkeyup", function (event) {
            const removeLastNumber = "Backspace";

            const isNumber = /^[0-9]$/i.test(event.key);

            if (!isNumber && event.key !== removeLastNumber)
                return false;

            const maxValue = parseFloat(this.getAttribute("max-value"));

            let valueText = this.value.replace(/\./g, "").replace(/\,/g, ".");

            if (isNumber)
                valueText += event.key;

            let digit = 10;

            if (!valueText.includes(".")) {
                digit = 0.01;
            }
            if (event.key === removeLastNumber) {
                digit = 0.1;
            }

            const newValue = valueText * digit;

            const value = newValue > maxValue ? maxValue : newValue;

            if (isNaN(value))
                return false;

            const valueInArray = toFixed(value, 2)
                .replace(/\./g, ",").split(",");

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

            this.dispatchEvent(new CustomEvent("changeValueMask", {
                value: newValueFormat
            }));

            return false;
        });

        function toFixed(number, dec) {
            const separate = number.toString().split(".");

            let decimal = "00";

            if (separate.length > 1)
                decimal = ((separate[1]).slice(0, dec)+"00").slice(0,2);

            return `${separate[0]}.${decimal}`;
        }*/
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
}