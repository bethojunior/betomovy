import { Dimensions, PixelRatio } from 'react-native';

const round = PixelRatio.roundToNearestPixel;

export const PIN_SIZE = round(14);
export const CARD_WIDTH = round(Dimensions.get('window').width / 2 - PIN_SIZE);
export const CARD_HEIGHT = round(40);
export const ETA_BADGE_WIDTH = round(40);
export const ACTION_COLUMN_WIDTH = round(36);

export const PIN_ANCHOR_OFFSET_Y = (cardH: number) => cardH + PIN_SIZE / 2;
