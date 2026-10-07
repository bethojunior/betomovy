global.Buffer = global.Buffer || require('buffer').Buffer;
import {format} from 'date-fns';
import {translate} from '../../../client/locales';
import { shade } from 'polished';

export default class Helper {
  static isEmailValid(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  static maskMoney(value) {
    if(!value || value == 0 || value === undefined || value === Infinity){
      return '0,00';
    }
  
    let isNegative = false;
    if (value < 0) {
      value = value * -1;
      isNegative = true;
    } if (value === 0) return '0,00';
  
    let number = value.toFixed(4).split('.');
  
    number = parseFloat(`${number[0]}.${number[1].slice(0, 2)}`);
  
    number = number.toFixed(2).split('.');
    number[0] = number[0].split(/(?=(?:...)*$)/).join('.');
  
    if (isNegative) return `-${number.join(',')}`;
  
    return number.join(',');
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

  static transformSecondsToMinutes(seconds) {
    if (!seconds) {
      return '';
    }
    if (seconds <= 60) {
      return seconds;
    }
    const minutes = Math.floor(seconds / 60);
    const secondsRest = seconds % 60;
    return `${minutes}:${String(secondsRest)?.padStart(2, '0')}`;
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
    const dateSplit = date.split(' ');
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

    if (discount >= parseFloat(coupon.limitedTo))
      discount = parseFloat(coupon.limitedTo);

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

  static getLatLonCenterFromGeom = coords => {
    const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    const centerLat = arrAvg(coords.map(c => c.lat));
    const centerLon = arrAvg(coords.map(c => c.lng));

    if (isNaN(centerLat) || isNaN(centerLon)) return null;
    else return {latitude: centerLat, longitude: centerLon};
  };

  static getFillColor(multiplierValue) {
    let index = Math.round((multiplierValue - 1) * 10);

    index = index >= 10 ? 9 : index;
    index = index < 0 ? 0 : index;

    const colors = [
      'rgba(213, 222, 129,0.4)',
      'rgba(213, 222, 129,0.5)',
      'rgba(254, 232, 132,0.4)',
      'rgba(254, 232, 132,0.5)',
      'rgba(251, 194, 124,0.4)',
      'rgba(251, 194, 124,0.5)',
      'rgba(248, 141, 114,0.4)',
      'rgba(248, 141, 114, 0.5)',
      'rgba(246, 105, 107, 0.4)',
      'rgba(246, 105, 107,0.5)',
    ];

    return colors[index];
  }

  static getLatitudeAndLongitudeFromStatusTrip = (
    statusTrip,
    trip,
    lat = null,
  ) => {
    if (lat) {
      switch (statusTrip) {
        case translate('statusTrip.accepted'):
          return trip?.startLatitude || trip?.origin?.latitude;
        case translate('statusTrip.in_progress'):
          return trip?.endLatitude || trip?.destination?.latitude;
        default:
          return trip?.endLatitude || trip?.destination?.latitude;
      }
    } else {
      switch (statusTrip) {
        case translate('statusTrip.accepted'):
          return trip?.startLongitude || trip?.origin?.longitude;
        case translate('statusTrip.in_progress'):
          return trip?.endLongitude || trip?.destination?.longitude;
        default:
          return trip?.endLongitude || trip?.destination?.longitude;
      }
    }
  };
  static getAddressFromStatusTrip = (statusTrip, trip) => {
    switch (statusTrip) {
      case translate('statusTrip.accepted'):
        return trip?.startAddress || trip?.origin?.address;
      case translate('statusTrip.in_progress'):
        return trip?.endAddress || trip?.destination?.name;
      default:
        return trip?.endAddress || trip?.destination?.name;
    }
  };

  // Função para converter km para milhas

  static kmToMiles(km, isMile = false) {
    if (isMile) {
      const conversionFactor = 0.621371;
      const miles = km * conversionFactor;
      return miles?.toFixed(2) + ' mi';
    }

    return Number(km).toFixed(2) + ' km';
  }

  // Condicional para verificar se existe a chave enviada, e generalSettings.

  static generalSettingsActive = (generalSettings, key) => {
    return (generalSettings?.find(
      item => item?.key === key,
    )?.value === '1' ? true : false)
  }

  static maskNames(name) {
    let value = name.split(' ');
    let lastIndex = value.length - 1;
    if (value.length > 2) {
      return `${value[0]} ${value[1].substring(0, 1)} ${value[lastIndex]}`;
    } else if (value.length === 1) {
      return value[0];
    }

    return `${value[0]} ${value[1]}`;
  }

  static generalSettingsValue = (generalSettings, key) => {
    return generalSettings?.find(item => item?.key === key)?.value;
  };

  static formatSecondsToDate(seconds) {
    const date = new Date(seconds * 1000);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${secondsFormatted}`;
  }

  static isOdd = (num) => {
    return Boolean(num % 2);
  };

  static assignColorByGroup = (reference, array = [], colors) => {
    const colorMap = {};
    const uniqueReferences = Array.from(
      new Set(array.map((item) => item.tripReference))
    );

    uniqueReferences.forEach((ref, index) => {
      colorMap[ref] = colors[index % colors.length];
    });

    return colorMap[reference] || 'gray';
  };
}
