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
