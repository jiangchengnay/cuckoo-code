import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { extract } = require('tar');
const https = require('node:https');

function download(url, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) { reject(new Error('too many redirects')); return; }
    https.get(url, { headers: { 'User-Agent': 'cuckoo-code-plugin-market' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(res.headers.location, depth + 1).then(resolve, reject);
      }
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
console.log('URL=' + url);
const buf = await download(url);
console.log('SIZE=' + buf.length);
console.log('MAGIC=' + buf[0] + ',' + buf[1] + ',' + buf[2]);  // gzip = 31,139,8

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gitee-e2e-'));
const tgz = path.join(tmp, 'pkg.tar.gz');
const stage = path.join(tmp, 'stage');
fs.mkdirSync(stage);
fs.writeFileSync(tgz, buf);
try {
  await extract({ file: tgz, cwd: stage, strip: 1 });
  const entries = fs.readdirSync(stage);
  console.log('EXTRACT_OK top=' + JSON.stringify(entries.slice(0, 5)));
  console.log('HAS_README=' + fs.existsSync(path.join(stage, 'README.md')));
} catch (e) {
  console.log('EXTRACT_FAIL=' + (e && e.message ? e.message.slice(0, 200) : String(e)));
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log('DONE');
