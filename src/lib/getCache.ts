import {CACHE_KEYS} from '../constants/caches';
import {DAY} from '../constants/times';
import {TIdentifyKey, TStorageName} from '../types';

const getCache = (storageName: TStorageName, keyPrefix: string) =>
  function get(identifyKey: TIdentifyKey, key: string, preserveTime = DAY) {
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = `${keyPrefix}.${key}`;
        const storage = window[storageName];
        const parsed = JSON.parse(storage.getItem(cacheKey) || '{}');

        if (Object.keys(parsed).every(eachKey => CACHE_KEYS.indexOf(eachKey) !== -1)) {
          if (parsed.identifyKey !== identifyKey || parsed.cachedAt + preserveTime < new Date().getTime()) {
            storage.removeItem(cacheKey);

            return null;
          }

          return parsed.data;
        }
      } catch (err) {
        return null;
      }
    }

    return null;
  };

export default getCache;
