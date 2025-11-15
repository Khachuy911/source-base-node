import { Readable } from 'stream';
import csv from 'csv-parser';

export async function readCSVFromBuffer(buffer: Buffer): Promise<any[]> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    const fileStream = Readable.from(buffer);
    fileStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
