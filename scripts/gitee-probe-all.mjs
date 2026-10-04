const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
function report(tag, buf, ct) {
  const gz = buf[0] === 31 && buf[1] === 139 && buf[2] === 8;
  console.log(tag + ': size=' + buf.length + ' ct=' + ct + ' gzip=' + gz + ' first3=' + buf[0]+','+buf[1]+','+buf[2]);
}
// 1) 默认 fetch（无任何 header）—— 等同 web-fetch
try {
  const res = await fetch(url, { method: 'GET' });
  const buf = Buffer.from(await res.arrayBuffer());
  report('default-fetch', buf, res.headers.get('content-type'));
} catch (e) { console.log('default-fetch ERR: ' + e.message); }

// 2) 默认 fetch + UA 头
try {
  const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'cuckoo-code-plugin-market' } });
  const buf = Buffer.from(await res.arrayBuffer());
  report('fetch+UA', buf, res.headers.get('content-type'));
} catch (e) { console.log('fetch+UA ERR: ' + e.message); }
