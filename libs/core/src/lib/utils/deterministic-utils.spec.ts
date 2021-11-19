import { getDeterministicGuid } from './deterministic-utils';

describe('DeterministicUtils', () => {
  it('should generate correct id', () => {
    const input = 'f335ad4e-dc0d-46ba-81a0-b8c98cefb747';
    const input2 = 'configversion';
    expect(getDeterministicGuid(input, input2)).toEqual(
      '3d4d426c-c33d-976c-00eb-ba380be816b3'
    );
  });
});
