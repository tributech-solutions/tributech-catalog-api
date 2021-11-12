export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function promiseTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race<Promise<T>>([promise, timeout as Promise<T>]);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function toEnumIgnoreCase<T>(
  target: T,
  key: string,
  silent: boolean = false
): T[keyof T] | undefined {
  if (!key) return undefined;
  const needle = key.toLowerCase();

  // If the enum Object does not have a key "0", then assume a string enum
  const _key = Object.keys(target).find(
    (k) => (target['0'] ? k : target[k]).toLowerCase() === needle
  );

  if (!_key) {
    if (silent) return undefined;
    const expected = Object.keys(target)
      .map((k) => (target['0'] ? k : target[k]))
      .filter((k) => isNaN(Number.parseInt(k)))
      .join(', ');
    console.error(`Could not map '${key}' to values ${expected}`);
    return undefined;
  }

  const name = target['0'] ? _key : target[_key];
  if (name !== key) {
    console.warn(`Ignored case to map ${key} to value ${name}`);
  }

  return target[_key];
}
