/** Represents a key-value store with better expiry functionality */
export interface IKeyStore {
  /** Sets a key with given expiry information
   * @param key The key
   * @param content The value associated with the key
   * @param softExpiration When the key will expire if it is not accessed again
   * @param softExpirationIncrement How many milliseconds the soft expiration should be pushed out if the key is accessed
   * @param hardExpiration When the key MUST expire
   */
  set(
    key: string,
    content: string,
    softExpiration: Date | null,
    softExpirationIncrement: number | null,
    hardExpiration: Date | null,
  ): Promise<void>;

  get(key: string): Promise<string | null>;
}

/** Represents a key value with expiry information */
export interface IKeyValue {
  /** The value associated with the key */
  content: string;

  /** When the key should expire if it is not accessed again */
  softExpiration: Date | null;

  /** How many milliseconds the soft expiration should be pushed out to everytime the key is accessed */
  softExpirationIncrement: number | null;

  /** When the key MUST expire, regardless of when it is accessed */
  hardExpiration: Date | null;
}

/** Gets the value associated with a key or null if the key does not exist or is expired
 * @param key The key
 * @returns The value or null
 */
export default class KeyStore implements IKeyStore {
  /** The Deno KV instance being mapped */
  private _store: Deno.Kv;

  /** Constructs the key store
   * @param store The Deno KV instance to wrap
   */
  public constructor(store: Deno.Kv) {
    this._store = store;
  }

  /** Sets a key with given expiry information
   * @param key The key
   * @param content The value associated with the key
   * @param softExpiration When the key will expire if it is not accessed again
   * @param softExpirationIncrement How many milliseconds the soft expiration should be pushed out to if the key is accessed
   * @param hardExpiration When the key MUST expire, regardless of when it is accessed
   */
  public async set(
    key: string,
    content: string,
    softExpiration: Date | null,
    softExpirationIncrement: number | null,
    hardExpiration: Date | null,
  ): Promise<void> {
    await this._store.set([key], {
      content,
      softExpiration,
      softExpirationIncrement,
      hardExpiration,
    });
  }

  /** Gets the value associated with a key or null if the key does not exist or is expired
   * @param key The key
   * @returns The value or null
   */
  public async get(key: string): Promise<string | null> {
    const result = await this._store.get<IKeyValue>([key]);

    if (result.value == null) return null;

    const now = new Date();
    const isExpired =
      (result.value.hardExpiration && now >= result.value.hardExpiration) ||
      (result.value.softExpiration && now >= result.value.softExpiration);

    if (isExpired) {
      await this._store.delete([key]);
      return null;
    }

    if (result.value.softExpiration && result.value.softExpirationIncrement) {
      await this.set(
        key,
        result.value.content,
        new Date(now.getTime() + result.value.softExpirationIncrement),
        result.value.softExpirationIncrement,
        result.value.hardExpiration,
      );
    }

    return result.value.content;
  }
}
