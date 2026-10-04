import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { extract } = require('tar');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'Referer': 'https://gitee.com/oschina/git-osc/tree/master',
};
function get(u, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 6) { reject(new Error('too many redirects')); return; }
    https.get(u, { headers: HEADERS }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); resolve(get(res.headers.location, depth + 1)); return;
      }
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
const buf = await get(url);
console.log('SIZE=' + buf.length + ' IS_GZIP=' + (buf[0] === 31 && buf[1] === 139 && buf[2] === 8));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gitee-e2e-'));
const tgz = path.join(tmp, 'pkg.tar.gz');
const stage = path.join(tmp, 'stage');
fs.mkdirSync(stage);
fs.writeFileSync(tgz, buf);
try {
  await extract({ file: tgz, cwd: stage, strip: 1 });
  console.log('EXTRACT_OK top=' + JSON.stringify(fs.readdirSync(stage).slice(0, 8)));
  console.log('HAS_README=' + fs.existsSync(path.join(stage, 'README.md')));
  console.log('=== E2E_SUCCESS ===');
} catch (e) {
  console.log('EXTRACT_FAIL=' + (e && e.message));
}
fs.rmSync(tmp, { recursive: true, force: true });
