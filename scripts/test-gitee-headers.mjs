import https from 'node:https';
const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Referer': 'https://gitee.com/oschina/git-osc',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Upgrade-Insecure-Requests': '1',
};
function step(u, depth) {
  if (depth > 6) { console.log('TOO_MANY'); return; }
  https.get(u, { headers: HEADERS }, (res) => {
    console.log('-> ' + res.statusCode + ' ct=' + (res.headers['content-type']||'') + ' loc=' + ((res.headers.location||'-')+'').slice(0,70));
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume(); step(res.headers.location, depth+1);
    } else {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const b = Buffer.concat(chunks);
        console.log('BODY size=' + b.length + ' first3=' + b[0]+','+b[1]+','+b[2]);
        console.log('IS_GZIP=' + (b[0]===31 && b[1]===139 && b[2]===8));
        console.log('DONE');
      });
    }
  }).on('error', e => console.log('ERR ' + e.message));
}
console.log('START');
step(url, 0);
