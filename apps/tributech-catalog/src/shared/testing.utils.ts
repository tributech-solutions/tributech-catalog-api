import { FactoryProvider, Type } from '@nestjs/common';

/**
 * Based on https://github.com/ngneat/spectator
 */

export type SpyObject<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer R
    ? T[P] & jest.Mock<R>
    : T[P];
};

export interface CompatibleSpy<T> extends jest.Mock<T> {
  /**
   * By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value.
   */
  andReturn(val: any): void;

  /**
   * By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function.
   */
  andCallFake(fn: (...args: any[]) => T): this;

  /**
   * removes all recorded calls
   */
  reset(): void;
}

export function installProtoMethods<T>(
  mock: any,
  proto: any,
  createSpyFn: (...args: any[]) => any
): void {
  if (proto === null || proto === Object.prototype) {
    return;
  }

  for (const key of Object.getOwnPropertyNames(proto)) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);

    if (!descriptor) {
      continue;
    }

    if (
      typeof descriptor.value === 'function' &&
      key !== 'constructor' &&
      typeof mock[key] === 'undefined'
    ) {
      mock[key] = createSpyFn(key);
    } else if (
      typeof descriptor.value === 'function' &&
      key !== 'constructor' &&
      typeof mock[key] !== 'undefined'
    ) {
      mock[key] = jest.fn().mockImplementation(mock[key]);
      // eslint-disable-next-line no-prototype-builtins
    } else if (descriptor.get && !mock.hasOwnProperty(key)) {
      Object.defineProperty(mock, key, {
        set: (value) => (mock[`_${key}`] = value),
        get: () => mock[`_${key}`],
        configurable: true,
      });
    }
  }

  installProtoMethods(mock, Object.getPrototypeOf(proto), createSpyFn);

  mock.castToWritable = () => mock;
}

export function createSpyObject<T>(
  type: Type<T>,
  template?: Partial<Record<keyof T, any>>
): SpyObject<T> {
  const mock: any = { ...template } || {};

  installProtoMethods(mock, type.prototype, () => {
    const jestFn = jest.fn();
    const newSpy: CompatibleSpy<any> = jestFn as any;

    newSpy.andCallFake = (fn: (...args: any[]) => any) => {
      jestFn.mockImplementation(fn);
      return newSpy;
    };

    newSpy.andReturn = (val: any) => {
      jestFn.mockReturnValue(val);
    };

    newSpy.reset = () => {
      jestFn.mockReset();
    };

    return newSpy;
  });

  return mock;
}

export function mockProvider<T>(
  type: Type<T>,
  properties?: Partial<Record<keyof T, any>>
): FactoryProvider {
  return {
    provide: type,
    useFactory: () => createSpyObject<T>(type, properties),
  };
}
