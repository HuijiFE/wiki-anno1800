/* eslint-disable no-console,no-await-in-loop,no-restricted-syntax */

import crypto from 'crypto';
import fs from 'fs';
import globby from 'globby';
import { genPathResolve } from '@huiji/shared-utils';

const resolvePath = genPathResolve(__dirname, '..');

const dataPath = resolvePath('..', 'data');

async function getFileHash(path: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  const input = fs.createReadStream(path);

  return new Promise<string>((resolve, reject) => {
    input.on('readable', () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        input.close();
        resolve(hash.digest('hex'));
      }
    });
  });
}

async function getAllFilesHash(): Promise<void> {
  const ddsFiles: string[] = [];

  const subDirs = await globby(['*'], {
    cwd: dataPath,
    onlyDirectories: true,
    absolute: true,
  });

  console.log(dataPath);
  console.log(subDirs.length);
  console.log(subDirs);

  for (const subDir of subDirs) {
    const partialFiles = await globby('**/*.dds', {
      cwd: subDir,
      deep: true,
      onlyFiles: true,
      absolute: true,
    });

    ddsFiles.push(...partialFiles);
  }

  console.log(ddsFiles.length);

  let maxLength = 0;
  ddsFiles.forEach(f => (maxLength = (f.length > maxLength && f.length) || maxLength));

  const ws = fs.createWriteStream(resolvePath('data', 'hash.txt'));
  for (const file of ddsFiles) {
    const hash = await getFileHash(file);
    ws.write(file);
    ws.write(' '.repeat(maxLength - file.length + 2));
    ws.write(hash);
    ws.write('\n');
  }
  ws.close();
}

getAllFilesHash().catch(console.error);
