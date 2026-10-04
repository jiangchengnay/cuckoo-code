import { createElectronHttpGet } from '../out/src/plugins/http.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { extract } = require('tar');

const httpGet = createElectronHttpGet();
const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
console.log('请求: ' + url);
const res = await httpGet({ url, timeoutMs: 60000 });
const gz = res.body[0] === 31 && res.body[1] === 139 && res.body[2] === 8;
console.log('status=' + res.status + ' ct=' + (res.headers['content-type'] || '-') + ' size=' + res.body.length + ' gzip=' + gz);

if (gz) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'http-gitee-'));
  const tgz = path.join(tmp, 'p.tar.gz');
  const stage = path.join(tmp, 'stage');
  fs.mkdirSync(stage);
  fs.writeFileSync(tgz, res.body);
  await extract({ file: tgz, cwd: stage, strip: 1 });
  console.log('EXTRACT_OK top=' + JSON.stringify(fs.readdirSync(stage).slice(0, 6)));
  console.log('=== HTTP_GITEE_CHANNEL_OK ===');
  fs.rmSync(tmp, { recursive: true, force: true });
} else {
  console.log('=== FAIL: 未拿到 gzip ===');
}
