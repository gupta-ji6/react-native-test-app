import Crypto from 'react-native-quick-crypto';
import {
  BinaryLike,
  CipherEncoding,
} from 'react-native-quick-crypto/lib/typescript/Utils';
import {Buffer} from '@craftzdog/react-native-buffer';

const DATA = {
  ip: '192.168.29.230',
  os: 'ios',
  os_version: '17.0.1',
  uuid: 'f6403d4c-3e03-40eb-8f3f-0f1961ca13b7',
  type: 'mobile',
  geocode: '0,0',
  app_name: 'com.razorpay.wallet.app',
};

const dataToEncrypt = JSON.stringify(DATA);
console.log('dataToEncrypt:', dataToEncrypt);

const CIPHER_INPUT_ENCODING_FORMAT: CipherEncoding = 'utf-8';
const CIPHER_OUTPUT_ENCODING_FORMAT: CipherEncoding = 'base64';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const IV_LENGTH_IN_BYTES = 16;

const IV = Crypto.randomBytes(IV_LENGTH_IN_BYTES);
// const IV = 'asdfghjklzxcvbnm';
console.log('iv:', IV);
console.log('string iv:', IV.toString());
console.log('base64 iv:', Buffer.from(IV).toString('base64'));

const KEY: BinaryLike = 'testKey1testKey1testKey1testKey1';
console.log('KEY:', KEY);

export const encrypt = async () => {
  console.log('============ ENCRYPTION =============');

  try {
    const cipher = Crypto.createCipheriv(ENCRYPTION_ALGORITHM, KEY, IV);

    let encryptedData = cipher.update(
      dataToEncrypt,
      CIPHER_INPUT_ENCODING_FORMAT,
      CIPHER_OUTPUT_ENCODING_FORMAT,
    );

    encryptedData += cipher.final(CIPHER_OUTPUT_ENCODING_FORMAT);
    console.log('encryptedData:', encryptedData);

    // create the cipher value in the required format - concatenation of IV & Encrypted Data
    const customCipherValue = IV.toString().concat(encryptedData as string);
    console.log('customCipherValue:', customCipherValue);

    return {
      iv: IV.toString(),
      cipher: encryptedData,
    };
  } catch (error) {
    console.error('Error in getEncryptedDeviceTokenHeader', error);
  }
};

export const decrypt = ({
  iv,
  cipher,
}: {
  iv: string;
  cipher: string | ArrayBuffer;
}) => {
  console.log('============ DECRYPTION =============');

  console.log('iv:', iv);

  const ivBuffer = Buffer.from(iv, 'utf-8');
  console.log('ivBuffer:', ivBuffer);
  console.log('ivBuffer length:', ivBuffer.byteLength);

  try {
    const decipher = Crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      KEY,
      ivBuffer,
    );

    let result = decipher.update(
      cipher,
      CIPHER_OUTPUT_ENCODING_FORMAT,
      CIPHER_INPUT_ENCODING_FORMAT,
    );

    result += decipher.final(CIPHER_INPUT_ENCODING_FORMAT);

    console.log('decrypted result:', result);
  } catch (error) {
    console.error('Error in decryptHeader', error);
  }
};
