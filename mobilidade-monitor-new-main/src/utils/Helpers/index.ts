export const CheckFormatVersionApp = (versionApp: string | null) => {
  if (versionApp) {
    const regex = /^\d+\.\d+\.\d+$/;

    return regex.test(versionApp);
  }
};

export const getKeyLocalStorage = (key: string) => {
  try {
    const response = localStorage.getItem(key);
    if (!response || response === "undefined" || response === "null" || response.trim() === "") {
      return null;
    }
    return JSON.parse(response);
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
};

export const formatTextWithoutCharacters = (text: string) => {
  let formattedText = text.toLowerCase();
  formattedText = formattedText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return formattedText.replace(/[^a-z0-9]/g, "");
};

export const useColorInverse = (color: any) => {
  let r;
  let g;
  let b;
  let teste: any = null;
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  teste = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (teste > 127.5) {
    return "#000000";
  } else {
    return "#ffffff";
  }
};

type AsyncFunction = (...args: any[]) => Promise<any>;

export function debounceAsync(fn: AsyncFunction, delay: number) {
  let isRunning = false;
  let timer: NodeJS.Timeout | null = null;

  return async (...args: any[]) => {
    if (isRunning) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => debounceAsync(fn, delay)(...args), delay);
      return;
    }

    isRunning = true;

    try {
      await fn(...args);
    } finally {
      isRunning = false;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
  };
}
