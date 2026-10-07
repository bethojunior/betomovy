global.Buffer = global.Buffer || require('buffer').Buffer;
import {format} from 'date-fns';
import * as Speech from 'expo-speech';

export default class Helper {
  static isEmailValid(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  static getTollIds(tolls) {
    if (!tolls || !Array.isArray(tolls)) {
      return [];
    }
    return tolls.map(toll =>
      typeof toll === 'object' && toll.id ? toll.id : toll,
    );
  }

  static maskMoney(value) {
    if (!value || value == 0 || value === undefined || value === Infinity) {
      return '0,00';
    }

    let isNegative = false;
    if (value < 0) {
      value = value * -1;
      isNegative = true;
    }
    if (value === 0) return '0,00';

    let number = value.toFixed(4)?.split('.');

    number = parseFloat(`${number[0]}.${number[1].slice(0, 2)}`);

    number = number.toFixed(2)?.split('.');
    number[0] = number[0]?.split(/(?=(?:...)*$)/).join('.');

    if (isNegative) return `-${number.join(',')}`;

    return number.join(',');
  }

  static unMask(value) {
    return value.replace(/[^0-9]/g, '');
  }

  static calculateValueItem(item, amount, complements) {
    let price = item.isOpenValue == false ? item.price : 0;
    if (complements.length > 0) {
      const items = [];
      complements.map(complementGroup => {
        complementGroup.items.map(item => items.push(item.price));
      });

      if (items.length > 0) {
        const value = items.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
        );
        price += value;
      }
    }

    return price * amount;
  }

  static getComplementByQuantity(group) {
    const accumulatorComplements = [];
    group.map(({items}) => {
      items.map(complement => {
        const item = accumulatorComplements.find(({deliveryComplementId}) => {
          return deliveryComplementId == complement.id;
        });

        if (item != null) {
          item.quantity += 1;
        } else {
          accumulatorComplements.push({
            deliveryComplementId: complement.id,
            quantity: 1,
          });
        }
      });
    });

    return accumulatorComplements;
  }

  static getNow() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  }

  static detectCardType(string) {
    const cardNumber = this.unMask(string);
    const flags = [
      {nome: 'Visa', regex: /^4[0-9]{12}(?:[0-9]{3})?$/},
      {nome: 'Mastercard', regex: /^5[1-5][0-9]{14}$/},
      {nome: 'American Express', regex: /^3[47][0-9]{13}$/},
      {nome: 'Diners Club', regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/},
      {nome: 'Discover', regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/},
      {nome: 'JCB', regex: /^(?:2131|1800|35\d{3})\d{11}$/},
    ];

    for (const flag of flags) {
      if (cardNumber.match(flag.regex)) {
        return flag.nome.toLowerCase();
      }
    }

    return 'Desconhecida';
  }

  static coinMoney = coin => {
    switch (coin) {
      case 'BRL':
        return 'R$';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return 'R$';
    }
  };

  static maskCardNumber(number) {
    const numberReplace = number?.substr(-4);
    return `****${numberReplace}`;
  }
  static formatDateAndHour(date) {
    const dateSplit = date?.split(' ');
    return `${convertDate(dateSplit[0])} ${maskHour(dateSplit[1])}`;
  }

  static starFloat = value => {
    return parseFloat(value).toPrecision(2);
  };

  static calculateDiscountByCoupon(price, coupon) {
    let discount = 0;
    if (coupon.valueType === '%') {
      discount = price * (parseFloat(coupon.value) / 100);
      if (discount > parseFloat(coupon.maxDiscountValue))
        discount = parseFloat(coupon.maxDiscountValue);
    } else {
      discount = coupon.value;
    }

    if (discount >= parseFloat(coupon.limitedTo)) discount = parseFloat(coupon.limitedTo);

    let newValue = price - discount;

    if (newValue <= 0) return 0;

    return newValue;
  }

  static changePriceByDiscount = (price, coupon) => {
    if (verifyCardOnCoupon) {
      return calculateDiscountByCoupon(price, coupon).toPrecision(4);
    }
    return selectedOptionTravel.price;
  };
  static timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  static indicatorsWithFilterId = (list, setPlaces) => {
    const newList = list
      .filter(item => {
        return item.latitude !== null;
      })
      .map(item => {
        return {
          ...item,
          item_latitude: item.latitude,
        };
      })
      .filter((item, index, self) => {
        return self.findIndex(t => t.item_latitude === item.latitude) === index;
      });
    setPlaces(newList);
    return newList;
  };

  static speakMessage = message => {
    Speech.speak(`${message} `, {
      language: 'pt-BR',
    });
  };

  static kmToMiles(km, isMile = false) {
    if (isMile) {
      const conversionFactor = 0.621371;
      const miles = km * conversionFactor;
      return miles?.toFixed(2) + ' mi';
    }

    return km + ' km';
  }

  static maskNames(name) {
    if (!name) return name;
    let value = name.split(' ');
    let lastIndex = value.length - 1;
    if (value.length > 2) {
      return `${value[0]} ${value[1].substring(0, 1)} ${value[lastIndex]}`;
    } else if (value.length === 1) {
      return `${value[0]}`;
    }

    return `${value[0]} ${value[1]}`;
  }

  // Condicional para verificar se existe a chave enviada, e generalSettings.

  static generalSettingsActive = (generalSettings, key) => {
    const config =  generalSettings?.find(item => item?.key === key);
    return Boolean(Number(config?.value || 0));
  };

  static formatDateBr = date => {
    if (!date) {
      return '';
    }
    if (date.includes('/')) {
      const [day, month, year] = date?.split('/');
      return `${day}/${month}/${year}`;
    } else if (date.length <= 0) {
      return '';
    } else {
      const [day, month, year] = date?.split('-');
      return `${year}/${month}/${day}`;
    }
  };

  static removeBarDate = date => {
    if (!date) {
      return '';
    }
    const date1 = date.replace('/', '-');
    const date2 = date1.replace('/', '-');

    return date2;
  };

  static formatDateDefault = date => {
    if (!date) {
      return '';
    }
    if (date.includes('/')) {
      const [day, month, year] = date?.split('/');
      return `${year}/${month}/${day}`;
    } else if (date.length <= 0) {
      return '';
    } else {
      const [day, month, year] = date?.split('-');
      return `${year}/${month}/${day}`;
    }
  };

  static formatDateApiDefault = date => {
    if (date.includes('/')) {
      const [day, month, year] = date?.split('/');
      return `${year}-${month}-${day}`;
    } else if (date.length <= 0) {
      return '';
    } else {
      const [day, month, year] = date?.split('-');
      return `${year}-${month}-${day}`;
    }
  };

  static generalSettingsValue = (generalSettings, key) => {
    return generalSettings?.find(item => item?.key === key)?.value;
  };

  static formatSecondsToDate(seconds) {
    const date = new Date(seconds * 1000);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  static formatDateInput(inputValue) {
    let cleanInput = inputValue.replace(/\D+/g, '');

    let day = cleanInput.slice(0, 2);
    let month = cleanInput.slice(2, 4);
    let year = cleanInput.slice(4, 8);

    if (cleanInput.length > 4) {
      return `${day}/${month}/${year}`;
    } else if (cleanInput.length > 2) {
      return `${day}/${month}`;
    } else {
      return day;
    }
  }

  static validateUrl(value) {
    if (!value) return false;
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value,
    );
  }

  static normalizeSocketUrl(url) {
    if (url.endsWith('/')) url = url.slice(0, -1);

    const match = url.match(/^(https?:\/\/[^\/:]+)(:\d+)?/);
    if (!match) return url;

    const host = match[1];
    const port = match[2] || '';

    return host + port;
  }
}
