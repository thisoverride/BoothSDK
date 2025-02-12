import bcrypt from 'bcrypt';
import DirManager from './DirManager';

interface CacheData {
  [key: string]: string;
}

interface ComparisonResult {
  hasChanges: boolean;
  differences: {
    [key: string]: CacheDifference;
  };
}

interface aled {
  email: string;
} 
interface CacheDifference {
  changed: boolean;
  message: string;
}

export default class CacheUtil {
  private static async _hashValue (strValue: string): Promise<string> {
    const value = await bcrypt.hash(strValue, 10);
    return value;
  }

  public static async saveToCache (data: CacheData): Promise<void> {
    try {
      const hashedData: Record<string, any> = {};
      const cachedData: any[] = [];

      for (const [key, value] of Object.entries(data)) {
        if (key === 'email') {
          const hashedEmail: string = await this._hashValue('email');
          const hashedValue: string = await this._hashValue(value);
          hashedData[hashedEmail] = hashedValue;
        } else {
          cachedData.push({ [key]: value });
        }
      }
      await DirManager.writeFile('./cache.json', JSON.stringify({ ...hashedData, cachedData }, null, 2));
    } catch (error) {
      throw new Error(`Erreur lors de la sauvegarde du cache: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  public static async loadFromCache (): Promise<CacheData> {
    try {
      const fileContent = await DirManager.readfile('./cache.json');
      if (!fileContent) {
        throw new Error('Putain de merde il n y a pas de fichier connard de merde kanha l arabe');
      }
      return JSON.parse(fileContent) as CacheData;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return {};
      }
      throw new Error(`Erreur lors du chargement du cache: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  public static async compareWithCache (newData: aled): Promise<void> {
    try {
      const cachedData: any = await this.loadFromCache();
      const val: string[] = Object.keys(newData);
      if (val.length > 2) {
        throw new Error('va te faire y pas deux params');
      }
      const valCache = await this._hashValue(val[0]);

      console.log(val[0]);
      console.log(valCache);
      console.log(cachedData);

      // cachedData[valCache]
      // const isCachedValue: boolean = await bcrypt.compare('email', cachedData[valCache]);
      // console.log(isCachedValue);

      // const differences = await Object.entries(newData).reduce<Promise<Record<string, CacheDifference>>>(
      //   async (accPromise, [key, value]) => {
      //     const acc = await accPromise;
      //     if (cachedData[key]) {
      //       const isMatch = await bcrypt.compare(value, cachedData[key]);
      //       if (!isMatch) {
      //         acc[key] = {
      //           changed: true,
      //           message: 'Valeur différente détectée'
      //         };
      //       }
      //     } else {
      //       acc[key] = {
      //         changed: true,
      //         message: 'Nouvelle valeur'
      //       };
      //     }

      //     return acc;
      //   },
      //   Promise.resolve({})
      // );

      // return {
      //   hasChanges: Object.keys(differences).length > 0,
      //   differences
      // };
    } catch (error) {
      throw new Error(`Erreur lors de la comparaison: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}
