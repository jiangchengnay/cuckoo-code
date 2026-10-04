const { app, net, session } = require('electron');
app.whenReady().then(async () => {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

  function httpGet(url, extraHeaders) {
    return new Promise((resolve) => {
      const req = net.request({ method: 'GET', url, redirect: 'manual', session: session.defaultSession });
      req.setHeader('User-Agent', UA);
      req.setHeader('Accept', '*/*');
      req.setHeader('Accept-Language', 'zh-CN,zh;q=0.9');
      req.setHeader('Referer', 'https://gitee.com/');
      for (const [k, v] of Object.entries(extraHeaders || {})) req.setHeader(k, v);
      req.on('response', (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const b = Buffer.concat(chunks);
          resolve({ status: res.statusCode, loc: res.headers.location || '', first3: b[0]+','+b[1]+','+b[2], size: b.length });
        });
      });
      req.on('error', (e) => resolve({ status: -1, err: e.message }));
      req.end();
    });
  }

  // A) 直接请求 archive（manual 重定向，看是否 302）
  const a = await httpGet('https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz');
  console.log('A archive: ' + JSON.stringify(a));

  // B) 先访问仓库页（拿 cookie），再请求 archive
  const home = await httpGet('https://gitee.com/oschina/git-osc');
  console.log('B home: status=' + home.status);
  const b = await httpGet('https://gitee.com/oschina/git-osc/repository/archive/master.tar.gz');
  console.log('B archive(带cookie): ' + JSON.stringify(b));

  app.quit();
});
