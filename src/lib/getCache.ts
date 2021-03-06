import {CACHE_KEYS} from '../constants/caches';
import {DAY} from '../constants/times';
import {TStorageName, TUniqId} from '../types';
import CacheMeta from './CacheMeta';

const getCache = (storageName: TStorageName, keyPrefix: string) =>
  function get(uniqId: TUniqId, key: string, preserveTime = DAY) {
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = `${keyPrefix}.${key}`;
        const storage = window[storageName];
        const parsed = JSON.parse(storage.getItem(cacheKey) || '{}');

        if (Object.keys(parsed).every(eachKey => CACHE_KEYS.indexOf(eachKey) !== -1)) {
          if (parsed.uniqId !== uniqId || parsed.cachedAt + preserveTime < new Date().getTime()) {
            storage.removeItem(cacheKey);

            return null;
          }
          const meta = new CacheMeta(keyPrefix, storage);
          if (!meta.isInMeta(cacheKey)[0]) {
            meta.setCache(cacheKey);
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
