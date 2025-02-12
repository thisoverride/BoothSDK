import crypto from 'crypto';
import DirManager from './DirManager';

interface CacheData {
  cachedData: CachedItem[];
  [key: string]: any;
}

interface CachedItem {
  [key: string]: string;
}

interface Credentials {
  token?: string;
  cookie?: string;
}

interface ComparisonResult {
  hasChanges: boolean;
  differences: {
    [key: string]: CacheDifference;
  };
}

interface CacheDifference {
  changed: boolean;
  message: string;
}

export default class CacheUtil {
  private static _hashValue(strValue: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(strValue);
    return hash.digest('hex');
  }

  private static _encrypt (text: string): string {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${key.toString('hex')}:${encrypted}`;
  }

  private static _decrypt (encryptedData: string): string {
    const [ivHex, keyHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(keyHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  public static async saveToCache (data: CacheData): Promise<void> {
    try {
      const encryptedData: Record<string, any> = {};
      const cachedData: CachedItem[] = [];

      for (const [key, value] of Object.entries(data)) {
        if (key === 'email') {
          const hashedEmail = this._hashValue('email');
          const encryptedValue = this._encrypt(String(value));
          encryptedData[hashedEmail] = encryptedValue;
        } else {
          cachedData.push({ [this._encrypt(key)]: this._encrypt(JSON.stringify(value)) });
        }
      }

      await DirManager.writeFile(
        './cache.json',
        JSON.stringify({ ...encryptedData, cachedData })
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la sauvegarde du cache: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    }
  }

  public static async loadFromCache (): Promise<CacheData> {
    try {
      const fileContent = await DirManager.readfile('./cache.json');
      if (!fileContent) {
        throw new Error('Le fichier de cache est manquant');
      }
      return JSON.parse(fileContent) as CacheData;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return { cachedData: [] };
      }
      throw new Error(
        `Erreur lors du chargement du cache: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    }
  }

  public static async compareWithCache (newData: Record<string, string>): Promise<any> {
    try {
      const cachedData = await this.loadFromCache();
      const keys = Object.keys(newData);
      if (keys.length > 2) {
        throw new Error('Illegal_parameters');
      }

      const hashedKey = this._hashValue(keys[0]);
      let isChanged: boolean = false;
      if (cachedData[hashedKey]) {
        const decryptedValue = this._decrypt(String(cachedData[hashedKey]));
        isChanged = decryptedValue !== newData[keys[0]];
      }

      const credentials: Credentials = {};
      if (!isChanged && Array.isArray(cachedData.cachedData)) {
        for (const item of cachedData.cachedData) {
          for (const [encryptedKey, encryptedValue] of Object.entries(item)) {
            const decryptedKey = this._decrypt(encryptedKey);
            if (decryptedKey === 'token') {
              credentials.token = this._decrypt(encryptedValue);
            }
            if (decryptedKey === 'cookie') {
              credentials.cookie = this._decrypt(encryptedValue);
            }
          }
        }
      }
      return { isChanged, ...credentials };
    } catch (error) {
      throw new Error(
        `Erreur lors de la comparaison: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    }
  }
}