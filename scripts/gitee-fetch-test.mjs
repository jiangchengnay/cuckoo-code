const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
try {
  const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36' } });
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('STATUS=' + res.status);
  console.log('FINAL_URL=' + res.url);
  console.log('CT=' + (res.headers.get('content-type') || '-'));
  console.log('SIZE=' + buf.length);
  console.log('FIRST3=' + buf[0] + ',' + buf[1] + ',' + buf[2]);
  console.log('IS_GZIP=' + (buf[0] === 31 && buf[1] === 139 && buf[2] === 8));
} catch (e) { console.log('ERR=' + e.message); }
