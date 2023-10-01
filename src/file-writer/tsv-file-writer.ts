import {FileWriterInterface} from './file-writer.interface.js';
import {createWriteStream, WriteStream} from 'node:fs';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 2 ** 16,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (this.stream.write(`${row}\n`)) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
  }
}
