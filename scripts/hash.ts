/* eslint-disable no-console,no-await-in-loop,no-restricted-syntax */

import crypto from 'crypto';
import fs from 'fs';
import globby from 'globby';
import { genPathResolve } from '@huiji/shared-utils';

const resolvePath = genPathResolve(__dirname, '..');

const dataPath = resolvePath('..', 'data');

const MAX_LENGTH = 200;

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

  ddsFiles.sort();
  console.log(ddsFiles.length);

  const ws = fs.createWriteStream(resolvePath('data', 'hash.txt'));
  for (const file of ddsFiles) {
    const hash = await getFileHash(file);
    ws.write(file);
    ws.write((file.length <= MAX_LENGTH && ' '.repeat(MAX_LENGTH - file.length)) || ' ');
    ws.write(hash);
    ws.write('\n');
  }
  ws.close();
}

getAllFilesHash().catch(console.error);
