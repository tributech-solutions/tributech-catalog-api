import { EMPTY } from 'rxjs';

export const GQLStub = {
  watch: () =>
    ({
      valueChanges: EMPTY,
    } as any),
  fetch: () => EMPTY,
  mutate: () => EMPTY,
};
