export const useColorInverse = (color: any) => {
  if (!color) {
    return undefined;
  }

  let r;
  let g;
  let b;
  let newColor: any;
  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  newColor = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Usando o valor HSP, determine se a cor é clara ou escura
  if (newColor > 127.5) {
    return "#000000";
  } else {
    return "#ffffff";
  }
};
