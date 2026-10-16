import {addSeconds, differenceInSeconds, format} from 'date-fns';

export function convertDate(date: string | Date) {
  if (typeof date === 'string') {
    return date?.split('-').reverse().join('/');
  }

  return date.toLocaleDateString();
}

export function maskHour(value: string) {
  if (!value) {
    return '';
  }
  let hour = value.replace(/[^0-9]/g, '') ?? '';
  if (hour.length > 2) {
    const hourForm = `${hour.substring(0, 2)}:${hour.substring(2, 4)}`;
    const [h, m] = hourForm?.split(':');
    if (Number(h) > 23) {
      hour = '23';
    }
    if (Number(m) > 59) {
      hour = `${h}:59`;
    }
    hour = hourForm;
  }
  return hour;
}

export function convertHourNewIntL(hour: string) {
  const [h, m] = hour?.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}

export function convertUSDate(date: string | Date) {
  if (typeof date === 'string') {
    return date?.split('/').reverse().join('-');
  }

  return format(date, 'yyyy-MM-dd');
}

export function today() {
  return format(new Date(), 'dd/MM/yyyy');
}

export function now() {
  return format(new Date(), 'dd/MM/yyyy - HH:mm');
}

export function convertDatetimeToDate(dateTime: string): string {
  return dateTime.substring(0, 10)?.split('-').reverse().join('/');
}

export function convertDateTime(dateTime: string): string {
  return format(new Date(dateTime), 'dd/MM/yyyy - HH:mm');
}

export function convertDatetimeToTime(dateTime: string): string {
  return dateTime.substring(11, 16);
}

export function getDayWithSpecificHours(
  day: Date,
  completeHours: string,
): Date {
  if (!completeHours) return new Date();
  const dayWithSpecificHours = new Date(day.valueOf());
  const [hours, min = 0, sec = 0, ms = 0] = completeHours
    ?.split(':')
    .map(value => Number(value));

  dayWithSpecificHours.setHours(hours, min, sec, ms);

  return dayWithSpecificHours;
}

export const getDateByApi = (datetime: string): Date => {
  const [date, time] = datetime?.split(' ');
  const [day, month, year] = date?.split('-');
  const iso = `${year}-${month}-${day}T${time}`;
  return new Date(iso);
};

export const getDateAndTimeInUtc = (date: string, hour: string) => {
  const utc = `${date}T${hour}Z`;
  return utc;
};

export const hourToUtc = (hour: string) => {
  const hourSplited = hour?.split(':');

  if (Number(hourSplited[0]) + 3 > 23) {
    return `${(Number(hourSplited[0]) - 21).toString()}:${hourSplited[1]}`;
  }
  return `${(Number(hourSplited[0]) + 3).toString()}:${hourSplited[1]}`;
};

export const getDiffDatesInSeconds = (start: string, end?: string) => {
  const startDate = getDateByApi(start || new Date().toISOString());
  const endDate = end ? getDateByApi(end) : new Date();

  return differenceInSeconds(startDate, endDate);
};

export const diffMinutes = (date: string) => {
  if (!date) return null;
  const start = new Date(date).getTime();

  const now = Date.now();
  const diff = Math.floor((now - start) / 1000);
  const minutes = Math.floor(diff / 60);

  return minutes;
};

export const diffSeconds = (start: string) => {
  if (!start) return null;
  const dateStartTripParse = new Date(JSON.parse(start));
  const dateNow = new Date();

  const diff = (dateNow.getTime() - dateStartTripParse.getTime()) / 1000;
  return diff.toFixed(0);
};

export const formatterSecondsToHours = (seconds: number) => {
  const helperDate = addSeconds(new Date(0), seconds);
  return format(helperDate, 'hh:mm:ss');
};

export const convertDateToBr = (date: string) => {
  const [year, month, day] = date?.split(' ')[0]?.split('-');
  return `${day}/${month}/${year}`;
};

export const getEstimatedTripTimeInMinutes = (detailsTrip: any): number => {
  const estimatedTripTime = Number(detailsTrip?.estimatedTripTime) || 0;
  return detailsTrip?.ride ? estimatedTripTime / 60 : estimatedTripTime;
};
