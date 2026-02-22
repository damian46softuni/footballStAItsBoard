import { Cache } from '../models/cache';

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Returns the cached data for `key` if it exists and was saved within the last hour.
 * Returns null if the cache is stale, missing, or MongoDB is unavailable.
 */
export async function getCached(key: string): Promise<unknown | null> {
  try {
    const doc = await Cache.findOne({ key }).lean();
    if (!doc) return null;
    const age = Date.now() - new Date(doc.savedAt).getTime();
    if (age >= ONE_HOUR_MS) return null;
    return doc.data;
  } catch {
    // MongoDB unavailable or query failed — treat as cache miss
    return null;
  }
}

/**
 * Upserts the given `data` into the cache under `key`, stamping `savedAt` to now.
 * Errors are swallowed so a write failure never breaks the API response.
 */
export async function setCached(key: string, data: unknown): Promise<void> {
  try {
    await Cache.findOneAndUpdate(
      { key },
      { key, data, savedAt: new Date() },
      { upsert: true, new: true }
    );
  } catch {
    // Ignore write failures
  }
}
