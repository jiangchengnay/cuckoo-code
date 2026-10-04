import { createElectronHttpGet } from '../out/src/plugins/http.js';
import { searchGiteePlugins, normalizeGiteeRepo } from '../out/src/plugins/market.js';

const httpGet = createElectronHttpGet();

// 1) 匿名用户仓库搜索（用 giteeUsers 机制）
process.env.CUCKOO_HOME = (process.env.USERPROFILE || process.env.HOME) + '/.cuckoo-test-market';
import fs from 'node:fs';
fs.mkdirSync(process.env.CUCKOO_HOME, { recursive: true });
fs.writeFileSync(process.env.CUCKOO_HOME + '/plugin-market.json', JSON.stringify({ giteeUsers: ['jiangcheng-cat-AI'] }), 'utf-8');

const items = await searchGiteePlugins({ httpGet });
console.log('找到 ' + items.length + ' 个 Gitee 仓库:');
for (const it of items) {
  console.log('  ' + it.id + ' | ' + it.description.slice(0, 30) + ' | branch=' + it.defaultBranch);
}

// 2) 归一化测试
const n = normalizeGiteeRepo({ full_name: 'a/b', default_branch: 'master' });
console.log('normalize: ' + JSON.stringify(n && { id: n.id, branch: n.defaultBranch }));

fs.rmSync(process.env.CUCKOO_HOME, { recursive: true, force: true });
console.log('=== MARKET_OK ===');
