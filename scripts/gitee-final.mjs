import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { extract } = require('tar');

const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
// 不带任何自定义 header
const res = await fetch(url, { method: 'GET' });
const buf = Buffer.from(await res.arrayBuffer());
console.log('SIZE=' + buf.length + ' CT=' + res.headers.get('content-type') + ' GZIP=' + (buf[0]===31&&buf[1]===139&&buf[2]===8));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gitee-'));
const tgz = path.join(tmp, 'p.tar.gz');
const stage = path.join(tmp, 'stage');
fs.mkdirSync(stage);
fs.writeFileSync(tgz, buf);
try {
  await extract({ file: tgz, cwd: stage, strip: 1, filter: (p) => !p.includes('..') });
  console.log('EXTRACT_OK top=' + JSON.stringify(fs.readdirSync(stage).slice(0, 8)));
  console.log('HAS_README=' + fs.existsSync(path.join(stage, 'README.md')));
  console.log('=== GITEE_DOWNLOAD_E2E_OK ===');
} catch (e) {
  console.log('EXTRACT_FAIL=' + (e && e.message));
}
fs.rmSync(tmp, { recursive: true, force: true });
