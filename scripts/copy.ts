/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import pth from 'path';
import mkdirp from 'mkdirp';
import globby from 'globby';
import { genPathResolve } from '@huiji/shared-utils';

const resolvePath = genPathResolve(__dirname, '..');

async function copy(): Promise<void> {
  const assets: Record<string, any> = {};
  (await globby(resolvePath('db', '*.json'))).sort().forEach(f =>
    Object.entries(JSON.parse(fs.readFileSync(f, 'utf-8'))).forEach((list: any[]) =>
      list.forEach(data => {
        assets[data.guid] = data;
      }),
    ),
  );
  fs.writeFileSync(resolvePath('Web', 'public', 'db.json'), JSON.stringify(assets));

  mkdirp.sync(resolvePath('Web', 'public', 'localization'));
  (await globby(resolvePath('localization', '*.json'))).sort().forEach(f => {
    fs.writeFileSync(
      resolvePath('Web', 'public', 'localization', pth.basename(f)),
      JSON.stringify(JSON.parse(fs.readFileSync(f, 'utf-8'))),
    );
  });
}

copy();
