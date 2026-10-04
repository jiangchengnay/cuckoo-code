const https = require('node:https');
const fs = require('fs');
const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36' } }, (res) => {
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const b = Buffer.concat(chunks);
    const html = b.toString('utf8');
    console.log('HEADERS:');
    console.log('  set-cookie=' + JSON.stringify(res.headers['set-cookie'] || []));
    console.log('  status=' + res.statusCode);
    console.log('HTML_LEN=' + html.length);
    console.log('HTML_HEAD=' + JSON.stringify(html.slice(0, 800)));
    fs.writeFileSync('B:/gitee-challenge.html', html);
  });
});
