import { createElectronHttpGet } from '../out/src/plugins/http.js';
const httpGet = createElectronHttpGet();

// 1) raw plugin.json（giteeFetch 无头）
try {
  const r = await httpGet({ url: 'https://gitee.com/oschina/git-osc/raw/master/README.md', timeoutMs: 30000 });
  console.log('RAW status=' + r.status + ' size=' + r.body.length + ' head=' + JSON.stringify(r.body.toString('utf-8').slice(0, 40)));
} catch (e) { console.log('RAW ERR=' + e.message); }

// 2) API 用户仓库列表
try {
  const r = await httpGet({ url: 'https://gitee.com/api/v5/users/jiangcheng-cat-AI/repos?per_page=100', timeoutMs: 30000 });
  console.log('API status=' + r.status + ' size=' + r.body.length);
  const arr = JSON.parse(r.body.toString('utf-8'));
  console.log('API repos=' + arr.length + ' names=' + JSON.stringify(arr.map(x => x.full_name).slice(0, 5)));
} catch (e) { console.log('API ERR=' + e.message); }
