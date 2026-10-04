const { app, net } = require('electron');
const fs = require('fs');

const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';

app.whenReady().then(() => {
  const req = net.request({ method: 'GET', url, redirect: 'follow' });
  req.setHeader('User-Agent', 'cuckoo-code-plugin-market');
  req.on('response', (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const b = Buffer.concat(chunks);
      console.log('STATUS=' + res.statusCode);
      console.log('CT=' + (res.headers['content-type'] || '-'));
      console.log('SIZE=' + b.length);
      console.log('FIRST3=' + b[0] + ',' + b[1] + ',' + b[2]);
      console.log('IS_GZIP=' + (b[0] === 31 && b[1] === 139 && b[2] === 8));
      try {
        fs.writeFileSync('B:/gitee-dl-test.tar.gz', b);
        console.log('SAVED');
      } catch (e) { console.log('SAVE_ERR=' + e.message); }
      app.quit();
    });
    res.on('error', (e) => { console.log('RES_ERR=' + (e && e.message)); app.quit(); });
  });
  req.on('error', (e) => { console.log('REQ_ERR=' + (e && e.message)); app.quit(); });
  req.end();
});
