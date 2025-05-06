// Robust localStorage helpers for type-safe get/set with error handling

/**
 * Save data to localStorage under a given key.
 * @param key The localStorage key
 * @param value The value to store (will be JSON-stringified)
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Optionally, handle quota exceeded or other errors
    // eslint-disable-next-line no-console
    console.error('Error saving to localStorage:', err);
  }
}

/**
 * Retrieve data from localStorage by key, with fallback to default value.
 * @param key The localStorage key
 * @param defaultValue The value to return if key is not found or parse fails
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    // Optionally, handle JSON parse errors
    // eslint-disable-next-line no-console
    console.error('Error reading from localStorage:', err);
    return defaultValue;
  }
}
