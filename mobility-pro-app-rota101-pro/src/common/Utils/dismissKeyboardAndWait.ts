import { Keyboard } from 'react-native';

const DEFAULT_TIMEOUT_MS = 200;

export function dismissKeyboardAndWait(timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<void> {
  return new Promise(resolve => {
    if (!Keyboard.isVisible()) {
      Keyboard.dismiss();
      resolve();
      return;
    }

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      subscription.remove();
      clearTimeout(timer);
      resolve();
    };

    const subscription = Keyboard.addListener('keyboardDidHide', finish);
    const timer = setTimeout(finish, timeoutMs);

    Keyboard.dismiss();
  });
}
