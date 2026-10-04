import https from 'node:https';
const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
function step(u, depth) {
  if (depth > 6) { console.log('  [too many redirects]'); return; }
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://gitee.com/' } }, (res) => {
    console.log('  -> ' + res.statusCode + ' ct=' + (res.headers['content-type']||'') + ' loc=' + (res.headers.location||'-').slice(0,80));
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume();
      step(res.headers.location, depth + 1);
    } else {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const b = Buffer.concat(chunks);
        console.log('  body: size=' + b.length + ' first3=' + b[0] + ',' + b[1] + ',' + b[2] + ' text=' + JSON.stringify(b.slice(0, 60).toString('utf8')));
        console.log('DONE');
      });
    }
  }).on('error', e => console.log('  ERR ' + e.message));
}
console.log('START ' + url);
step(url, 0);
