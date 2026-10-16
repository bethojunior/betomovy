import FileSystemLocal from '../../../utils/FileSystem';
import {storage} from '../mmkv/storage';

const LOGIN_FLAG_KEY = 'login-for-ia';
const LOGIN_EMAIL_PREFIX = 'LoginAuthPRO-704apps-email';
const LOGIN_PASSWORD_PREFIX = 'LoginAuthPRO-704apps-password';

export interface AutoLoginResult {
  email: string;
  password: string;
}

export async function getAutoLoginCredentials(): Promise<AutoLoginResult | null> {
  const fileSystemLocal = new FileSystemLocal();

  try {
    const alreadyLogged = storage.getItem(LOGIN_FLAG_KEY, 'boolean');
    if (alreadyLogged) return null;

    const folders = await fileSystemLocal.findFolders();
    if (!folders || folders.length === 0) return null;

    const emailEntry = folders.find((item: string) =>
      item.includes(LOGIN_EMAIL_PREFIX),
    );
    const passwordEntry = folders.find((item: string) =>
      item.includes(LOGIN_PASSWORD_PREFIX),
    );

    if (!emailEntry || !passwordEntry) return null;

    const email = emailEntry?.split('-').pop();
    const password = passwordEntry?.split('-').pop();

    if (!email || !password) return null;

    storage.setItem(LOGIN_FLAG_KEY, true);

    return {email, password};
  } catch (error) {
    console.warn(
      '[getAutoLoginCredentials] Erro ao buscar credenciais:',
      error,
    );
    return null;
  }
}
