/* eslint-disable no-restricted-syntax,no-await-in-loop,no-console */
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';
import pth from 'path';
import { genPathResolve } from '@huiji/shared-utils';

import { allTemplates, Asset, Product, ItemBuff } from '@public/db/definition';
import {
  resolveDatabase,
  Language,
  BASE_ROUTER_PATH,
  SERIALIZE_ELEMENT_ID,
} from '@src/utils';

const resolvePath = genPathResolve(__dirname, '..');

dotenv.config({
  path: resolvePath('.env'),
});

const PORT = process.env.VUE_APP_PORT;

async function getPaths(): Promise<string[]> {
  const languages: Language[] = ['en', 'zh-CN'];
  const result = [] as string[];
  const add: (...paths: (string | number)[]) => void = (...nodes) =>
    languages.forEach(l => result.push(`${l}/${nodes.join('/')}`));

  const [dict, list] = resolveDatabase(
    await Promise.all(
      allTemplates.map(async t =>
        fs.promises
          .readFile(resolvePath('public', 'db', `${t}.json`), 'utf8')
          .then(c => JSON.parse(c) as Asset[]),
      ),
    ),
  );

  ['products', 'items'].forEach(path => add(path));
  [['product', 'product'], ['item', 'item']].forEach(([prop, genre]) =>
    list.forEach(a => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((a as any)[prop]) {
        add(genre, a.guid);
      }
    }),
  );

  return result.sort();
}

async function savePage(path: string, content: string): Promise<void> {
  const dest = resolvePath('dist', `${path}.html`);
  const dir = pth.dirname(dest);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(dest, content);
}

async function build(): Promise<void> {
  const browser = await puppeteer.launch({
    executablePath: '/mnt/c/Program Files (x86)/Google/Chrome Dev/Application/chrome.exe',
    devtools: false,
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  const allPaths = await getPaths();

  for (const path of allPaths) {
    await page.goto(`http://localhost:${PORT}${BASE_ROUTER_PATH}${path}`);
    await page.waitFor('.v-app_wrapper');

    const app = await page.$eval('#app', el => el.outerHTML);
    const serialize = await page
      .$eval(`#${SERIALIZE_ELEMENT_ID}`, el => el.outerHTML)
      .catch(error => {
        console.error(error);
        return '';
      });
    await savePage(path, `${app}${serialize}`);
    console.log(path);
  }

  await browser.close();
}

async function test(): Promise<void> {
  const browser = await puppeteer.launch({
    executablePath: '/mnt/c/Program Files (x86)/Google/Chrome Dev/Application/chrome.exe',
    devtools: false,
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();

  await page.goto(`http://localhost:1800/wiki/Anno1800/zh-CN/test`);
}

// build();
test();
