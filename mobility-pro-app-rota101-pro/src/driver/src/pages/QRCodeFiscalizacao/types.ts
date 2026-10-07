export interface QRCodeRef {
  toDataURL: (callback: (dataURL: string) => void) => void;
}

export const DELAY_BEFORE_DELETE_MS = 5000;
export const QRCODE_SIZE = 300;
