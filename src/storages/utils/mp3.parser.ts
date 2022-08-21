export default class Mp3Parser {
  private bitrate: number; // bitrate in bits per second
  private size: number; // size in bits

  constructor(buffer: Buffer, offset: number) {

  }

  public calcDuration(numFrames: number): number {
    return buffer.
  }

  private calcSamplesPerFrame(): number {
    return 
  }

  private getBitAllignedNumber(source: Uint8Array, byteOffset: number, bitOffset: number, len: number): number {
    const byteOff = byteOffset + ~~(bitOffset / 8);
    const bitOff = bitOffset % 8;
    let value = source[byteOff];
    value &= 0xff >> bitOff;
    const bitsRead = 8 - bitOff;
    const bitsLeft = len - bitsRead;
    if (bitsLeft < 0) {
      value >>= (8 - bitOff - len);
    } else if (bitsLeft > 0) {
      value <<= bitsLeft;
      value |= this.getBitAllignedNumber(source, byteOffset, bitOffset + bitsRead, bitsLeft);
    }
    return value;
  }
}
