import fs from 'fs';

let tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));

const fmhyTools = [
  { name: 'uBlock Origin', url: 'https://ublockorigin.com/', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'An efficient, CPU and memory-friendly wide-spectrum content blocker.', learningCurve: 'Easy', alternativeTo: 'Adblock Plus', isFree: true, isOpenSource: true, tags: ['Privacy', 'Browser', 'Adblocker'] },
  { name: 'Pi-hole', url: 'https://pi-hole.net/', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'A black hole for Internet advertisements, running as a DNS sinkhole.', learningCurve: 'Medium', alternativeTo: 'NextDNS', isFree: true, isOpenSource: true, tags: ['Privacy', 'DNS', 'Self-Hosted'] },
  { name: 'AdGuard Home', url: 'https://adguard.com/en/adguard-home/overview.html', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'Network-wide software for blocking ads & tracking.', learningCurve: 'Medium', alternativeTo: 'Pi-hole', isFree: true, isOpenSource: true, tags: ['Privacy', 'DNS', 'Self-Hosted'] },
  { name: 'LocalSend', url: 'https://localsend.org/', category: 'Automation & Integration', type: '[OS][F]', description: 'Share files to nearby devices. Free, open source, cross-platform.', learningCurve: 'Easy', alternativeTo: 'AirDrop', isFree: true, isOpenSource: true, tags: ['Utility', 'Transfer'] },
  { name: 'Syncthing', url: 'https://syncthing.net/', category: 'Automation & Integration', type: '[OS][F]', description: 'Continuous file synchronization program.', learningCurve: 'Medium', alternativeTo: 'Dropbox / Google Drive', isFree: true, isOpenSource: true, tags: ['Storage', 'Sync', 'Self-Hosted'] },
  { name: 'Bitwarden', url: 'https://bitwarden.com/', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'Open source password manager.', learningCurve: 'Easy', alternativeTo: '1Password / LastPass', isFree: true, isOpenSource: true, tags: ['Privacy', 'Security'] },
  { name: 'Uptime Kuma', url: 'https://github.com/louislam/uptime-kuma', category: 'Web Development', type: '[OS][F]', description: 'A fancy self-hosted monitoring tool.', learningCurve: 'Medium', alternativeTo: 'UptimeRobot', isFree: true, isOpenSource: true, tags: ['DevTools', 'Monitoring', 'Self-Hosted'] },
  { name: 'Coolify', url: 'https://coolify.io/', category: 'Web Development', type: '[OS][F]', description: 'An open-source & self-hostable Heroku / Netlify / Vercel alternative.', learningCurve: 'Steep', alternativeTo: 'Vercel / Heroku', isFree: true, isOpenSource: true, tags: ['DevTools', 'Hosting', 'Self-Hosted'] },
  { name: 'Penpot', url: 'https://penpot.app/', category: 'Design & Visual', type: '[OS][F]', description: 'Open-source design and prototyping platform.', learningCurve: 'Medium', alternativeTo: 'Figma', isFree: true, isOpenSource: true, tags: ['Design', 'UI'] },
  { name: 'Draw.io', url: 'https://draw.io/', category: 'Design & Visual', type: '[OS][F]', description: 'Free online diagram software.', learningCurve: 'Easy', alternativeTo: 'Lucidchart', isFree: true, isOpenSource: true, tags: ['Design', 'Diagrams'] }
];

tools.push(...fmhyTools);
fs.writeFileSync('src/data/tools.json', JSON.stringify(tools, null, 2));
console.log('Added ' + fmhyTools.length + ' FMHY tools.');
