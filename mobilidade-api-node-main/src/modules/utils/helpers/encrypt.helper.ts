import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptHelper {
  encrypt(jsonToEncrypt: string, key: string): string {
    const iv = randomBytes(16).toString('hex').slice(0, 16);
    const encrypter = createCipheriv('aes-256-cbc', key, iv);
    let encryptedMsg = encrypter.update(jsonToEncrypt, 'utf8', 'hex');
    encryptedMsg += encrypter.final('hex');
    return iv + ':' + encryptedMsg;
  }
}
