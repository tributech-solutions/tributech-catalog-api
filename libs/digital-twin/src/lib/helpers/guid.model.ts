/**
 * Based on https://github.com/dalaqa/guid/blob/master/javascriptGuid
 */
export class GUID {
  private _a: number;
  private _b: number;
  private _c: number;
  private _d: number;
  private _e: number;
  private _f: number;
  private _g: number;
  private _h: number;
  private _i: number;
  private _j: number;
  private _k: number;

  constructor(private byteArray: any) {
    if (byteArray == null) return;
    if (byteArray.length != 16) return;

    this._a =
      (byteArray[3] << 24) |
      (byteArray[2] << 16) |
      (byteArray[1] << 8) |
      byteArray[0];
    this._b = (byteArray[5] << 8) | byteArray[4];
    this._c = (byteArray[7] << 8) | byteArray[6];
    this._d = byteArray[8];
    this._e = byteArray[9];
    this._f = byteArray[10];
    this._g = byteArray[11];
    this._h = byteArray[12];
    this._i = byteArray[13];
    this._j = byteArray[14];
    this._k = byteArray[15];
  }

  HexToChar(a) {
    a = a & 0xf;
    return String.fromCharCode(a > 9 ? a - 10 + 0x61 : a + 0x30);
  }

  HexsToChars(guidChars, offset, a, b) {
    guidChars[offset++] = this.HexToChar(a >> 4);
    guidChars[offset++] = this.HexToChar(a);
    guidChars[offset++] = this.HexToChar(b >> 4);
    guidChars[offset++] = this.HexToChar(b);
    return offset;
  }

  toString() {
    const guidChars = new Array(36);
    let offset = 0;
    // [{|(]dddddddd[-]dddd[-]dddd[-]dddd[-]dddddddddddd[}|)]
    offset = this.HexsToChars(guidChars, offset, this._a >> 24, this._a >> 16);
    offset = this.HexsToChars(guidChars, offset, this._a >> 8, this._a);
    guidChars[offset++] = '-';
    offset = this.HexsToChars(guidChars, offset, this._b >> 8, this._b);
    guidChars[offset++] = '-';
    offset = this.HexsToChars(guidChars, offset, this._c >> 8, this._c);
    guidChars[offset++] = '-';
    offset = this.HexsToChars(guidChars, offset, this._d, this._e);
    guidChars[offset++] = '-';
    offset = this.HexsToChars(guidChars, offset, this._f, this._g);
    offset = this.HexsToChars(guidChars, offset, this._h, this._i);
    offset = this.HexsToChars(guidChars, offset, this._j, this._k);

    return guidChars.join('');
  }
}
