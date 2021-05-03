const ChromeLauncher = require('chrome-launcher');

const proxy = "--proxy-server=http://127.0.0.1:8213";

ChromeLauncher.launch({
  startingUrl: 'http://192.168.33.10:3333',
  chromeFlags: ['--guest', proxy]
}).then(chrome => {
  console.log(`Chrome debugging port running on ${chrome.port}`);
});
