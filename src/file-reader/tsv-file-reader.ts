import {FileReaderInterface} from './file-reader.interface.js';
import EventEmitter from 'node:events';
import {createReadStream} from 'node:fs';
export default class TSVFileReader extends EventEmitter implements FileReaderInterface {

  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: 2 ** 16,
      encoding: 'utf-8',
    });

    let data = '';
    let nextLine = -1;
    let rowCount = 0;

    for await (const chunk of stream) {
      data += chunk.toString();

      while ((nextLine = data.indexOf('\n')) >= 0) {
        const completeRow = data.slice(0, nextLine + 1);
        data = data.slice(++nextLine);
        rowCount++;

        this.emit('row', completeRow);
      }
    }

    this.emit('end', rowCount);
  }
}
