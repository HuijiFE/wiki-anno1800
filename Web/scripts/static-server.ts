/* eslint-disable no-console */

import fs from 'fs';
import express, { RequestHandler } from 'express';
import { genPathResolve } from '@huiji/shared-utils';

const resolvePath = genPathResolve(__dirname, '..');

const port = 1800;
const args = process.argv.slice(2);

const staticHandler = express.static(resolvePath('dist'), {
  index: false,
  maxAge: 365 * 24 * 60 * 60 * 1000,
});
const staticNotFoundHandler: RequestHandler = (request, response) => {
  response.sendStatus(404);
};

const indexPath = resolvePath('dist', 'index.html');
const indexHandler: RequestHandler = (request, response) => {
  response.sendFile(indexPath);
};

const app = express();

app
  .use('/static', staticHandler)
  .use('/static/*', staticNotFoundHandler)
  .get('*', indexHandler)
  .listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
  });
