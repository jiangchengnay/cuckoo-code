const { app, net } = require('electron');
app.whenReady().then(() => {
  const url = 'https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz';
  const req = net.request({ method: 'GET', url, redirect: 'follow' });
  // 不设 User-Agent
  req.on('response', (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const b = Buffer.concat(chunks);
      console.log('NET_CT=' + (res.headers['content-type'] || '-'));
      console.log('NET_SIZE=' + b.length + ' GZIP=' + (b[0]===31&&b[1]===139&&b[2]===8));
      app.quit();
    });
  });
  req.on('error', (e) => { console.log('NET_ERR=' + e.message); app.quit(); });
  req.end();
});
