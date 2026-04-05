import fs from 'fs';

let tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));

// Massive injection of strict alternatives
const bulkTools = [
  // Video Editing
  { name: 'Adobe Premiere Pro', url: 'https://www.adobe.com/', category: 'Design & Visual', type: '[$]', description: 'Industry standard video editing software.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Video', 'Editing', 'Creative'] },
  { name: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com/', category: 'Design & Visual', type: '[F]', description: 'Hollywood grade video editing, color correction, and audio post production.', learningCurve: 'Steep', alternativeTo: 'Adobe Premiere Pro', isFree: true, isOpenSource: false, tags: ['Video', 'Editing', 'Creative'] },
  { name: 'Kdenlive', url: 'https://kdenlive.org/', category: 'Design & Visual', type: '[OS][F]', description: 'Open source video editor.', learningCurve: 'Medium', alternativeTo: 'Adobe Premiere Pro', isFree: true, isOpenSource: true, tags: ['Video', 'Editing'] },
  { name: 'CapCut', url: 'https://www.capcut.com/', category: 'Design & Visual', type: '[F]', description: 'Fast, viral video editing for social media.', learningCurve: 'Easy', alternativeTo: 'Adobe Premiere Pro', isFree: true, isOpenSource: false, tags: ['Video', 'Editing', 'Social'] },

  // Browsers
  { name: 'Google Chrome', url: 'https://www.google.com/chrome/', category: 'Privacy & Security Analytics', type: '[F]', description: 'The most popular web browser.', learningCurve: 'Easy', alternativeTo: '', isFree: true, isOpenSource: false, tags: ['Browser', 'Internet'] },
  { name: 'Brave', url: 'https://brave.com/', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'Secure, fast, and private web browser with built-in ad blocker.', learningCurve: 'Easy', alternativeTo: 'Google Chrome', isFree: true, isOpenSource: true, tags: ['Browser', 'Privacy', 'Crypto'] },
  { name: 'Firefox', url: 'https://www.mozilla.org/', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'Free and open-source web browser developed by the Mozilla Foundation.', learningCurve: 'Easy', alternativeTo: 'Google Chrome', isFree: true, isOpenSource: true, tags: ['Browser', 'Privacy', 'Open-Source'] },
  { name: 'Mullvad Browser', url: 'https://mullvad.net/en/browser', category: 'Privacy & Security Analytics', type: '[OS][F]', description: 'A privacy-focused browser built in collaboration with Tor.', learningCurve: 'Medium', alternativeTo: 'Google Chrome', isFree: true, isOpenSource: true, tags: ['Browser', 'Privacy', 'Anonymous'] },

  // CRM & Business
  { name: 'HubSpot CRM', url: 'https://www.hubspot.com/', category: 'Data & Business Intelligence', type: '[$][F]', description: 'Powerful, enterprise CRM.', learningCurve: 'Medium', alternativeTo: '', isFree: true, isOpenSource: false, tags: ['CRM', 'Sales', 'Enterprise'] },
  { name: 'Salesforce', url: 'https://www.salesforce.com/', category: 'Data & Business Intelligence', type: '[$]', description: 'The global standard enterprise CRM.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['CRM', 'Sales', 'Enterprise'] },
  { name: 'Odoo', url: 'https://www.odoo.com/', category: 'Data & Business Intelligence', type: '[OS][F]', description: 'Open Source ERP and CRM.', learningCurve: 'Steep', alternativeTo: 'HubSpot CRM', isFree: true, isOpenSource: true, tags: ['CRM', 'ERP', 'Business'] },
  { name: 'Twenty', url: 'https://twenty.com/', category: 'Data & Business Intelligence', type: '[OS][F]', description: 'Modern, open-source CRM alternative to Salesforce.', learningCurve: 'Medium', alternativeTo: 'Salesforce', isFree: true, isOpenSource: true, tags: ['CRM', 'Sales'] },

  // Design (Vector/Image)
  { name: 'Adobe Illustrator', url: 'https://adobe.com/', category: 'Design & Visual', type: '[$]', description: 'Industry standard vector graphics software.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Design', 'Vector', 'Creative'] },
  { name: 'Inkscape', url: 'https://inkscape.org/', category: 'Design & Visual', type: '[OS][F]', description: 'Professional quality vector graphics software.', learningCurve: 'Medium', alternativeTo: 'Adobe Illustrator', isFree: true, isOpenSource: true, tags: ['Design', 'Vector', 'Open-Source'] },
  { name: 'Adobe Photoshop', url: 'https://adobe.com/', category: 'Design & Visual', type: '[$]', description: 'Standard for image editing and digital art.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Design', 'Image Editing', 'Creative'] },
  { name: 'Krita', url: 'https://krita.org/', category: 'Design & Visual', type: '[OS][F]', description: 'Professional free and open source painting program.', learningCurve: 'Medium', alternativeTo: 'Adobe Photoshop', isFree: true, isOpenSource: true, tags: ['Design', 'Image Editing', 'Painting'] },

  // Audio Editing
  { name: 'Adobe Audition', url: 'https://adobe.com/', category: 'Design & Visual', type: '[$]', description: 'Professional audio workstation for mixing and editing.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Audio', 'Editing', 'Creative'] },
  { name: 'Audacity', url: 'https://www.audacityteam.org/', category: 'Design & Visual', type: '[OS][F]', description: 'Free, open source, cross-platform audio software.', learningCurve: 'Medium', alternativeTo: 'Adobe Audition', isFree: true, isOpenSource: true, tags: ['Audio', 'Editing'] },
  { name: 'Tenacity', url: 'https://tenacityaudio.org/', category: 'Design & Visual', type: '[OS][F]', description: 'Privacy-focused fork of Audacity.', learningCurve: 'Medium', alternativeTo: 'Adobe Audition', isFree: true, isOpenSource: true, tags: ['Audio', 'Editing', 'Privacy'] },

  // Project Management
  { name: 'Jira', url: 'https://www.atlassian.com/software/jira', category: 'Automation & Integration', type: '[$]', description: 'Enterprise agile project management.', learningCurve: 'Steep', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Project Management', 'Agile', 'Enterprise'] },
  { name: 'Asana', url: 'https://asana.com/', category: 'Automation & Integration', type: '[$][F]', description: 'Team task management interface.', learningCurve: 'Medium', alternativeTo: '', isFree: true, isOpenSource: false, tags: ['Project Management', 'Tasks'] },
  { name: 'OpenProject', url: 'https://www.openproject.org/', category: 'Automation & Integration', type: '[OS][F]', description: 'Open source project management software.', learningCurve: 'Medium', alternativeTo: 'Jira', isFree: true, isOpenSource: true, tags: ['Project Management', 'Open-Source'] },
  { name: 'Focalboard', url: 'https://www.focalboard.com/', category: 'Automation & Integration', type: '[OS][F]', description: 'Open source alternative to Trello, Notion, and Asana.', learningCurve: 'Easy', alternativeTo: 'Asana', isFree: true, isOpenSource: true, tags: ['Project Management', 'Kanban'] },

  // Communication & Mail
  { name: 'Slack', url: 'https://slack.com/', category: 'Automation & Integration', type: '[$][F]', description: 'Corporate team communication platform.', learningCurve: 'Easy', alternativeTo: '', isFree: true, isOpenSource: false, tags: ['Chat', 'Communication', 'Enterprise'] },
  { name: 'Mattermost', url: 'https://mattermost.com/', category: 'Automation & Integration', type: '[OS][F]', description: 'Open-source, self-hostable Slack alternative.', learningCurve: 'Medium', alternativeTo: 'Slack', isFree: true, isOpenSource: true, tags: ['Chat', 'Communication', 'Self-Hosted'] },
  { name: 'Superhuman', url: 'https://superhuman.com/', category: 'Email Marketing & CRM', type: '[$]', description: 'The fastest email experience made for professionals.', learningCurve: 'Medium', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Email', 'Productivity'] },
  { name: 'Thunderbird', url: 'https://www.thunderbird.net/', category: 'Email Marketing & CRM', type: '[OS][F]', description: 'Free, open-source email client backed by Mozilla.', learningCurve: 'Medium', alternativeTo: 'Superhuman', isFree: true, isOpenSource: true, tags: ['Email', 'Client', 'Open-Source'] },
  { name: 'Mailspring', url: 'https://getmailspring.com/', category: 'Email Marketing & CRM', type: '[OS][F]', description: 'Beautiful, fast email client.', learningCurve: 'Easy', alternativeTo: 'Superhuman', isFree: true, isOpenSource: true, tags: ['Email', 'Client'] },

  // Office & Productivity
  { name: 'Microsoft 365', url: 'https://www.office.com/', category: 'Automation & Integration', type: '[$]', description: 'Standard enterprise productivity suite.', learningCurve: 'Medium', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Office', 'Productivity', 'Enterprise'] },
  { name: 'LibreOffice', url: 'https://www.libreoffice.org/', category: 'Automation & Integration', type: '[OS][F]', description: 'Free and powerful office suite.', learningCurve: 'Medium', alternativeTo: 'Microsoft 365', isFree: true, isOpenSource: true, tags: ['Office', 'Productivity', 'Open-Source'] },
  { name: 'OnlyOffice', url: 'https://www.onlyoffice.com/', category: 'Automation & Integration', type: '[OS][F]', description: 'Secure online office apps highly compatible with MS formats.', learningCurve: 'Medium', alternativeTo: 'Microsoft 365', isFree: true, isOpenSource: true, tags: ['Office', 'Collaboration'] },

  // Note Taking
  { name: 'Notion', url: 'https://notion.so/', category: 'Automation & Integration', type: '[$][F]', description: 'All-in-one workspace for notes and databases.', learningCurve: 'Medium', alternativeTo: '', isFree: true, isOpenSource: false, tags: ['Notes', 'Wiki', 'Productivity'] },
  { name: 'Obsidian', url: 'https://obsidian.md/', category: 'Automation & Integration', type: '[F]', description: 'Private and flexible writing app that adapts to the way you think.', learningCurve: 'Steep', alternativeTo: 'Notion', isFree: true, isOpenSource: false, tags: ['Notes', 'Markdown', 'Local'] },
  { name: 'AppFlowy', url: 'https://www.appflowy.io/', category: 'Automation & Integration', type: '[OS][F]', description: 'Open Source Alternative to Notion.', learningCurve: 'Medium', alternativeTo: 'Notion', isFree: true, isOpenSource: true, tags: ['Notes', 'Wiki', 'Open-Source'] },

  // Utilities & Archiving
  { name: 'WinRAR', url: 'https://www.win-rar.com/', category: 'Web Development', type: '[$]', description: 'Popular file archiver utility.', learningCurve: 'Easy', alternativeTo: '', isFree: false, isOpenSource: false, tags: ['Utility', 'Archive'] },
  { name: '7-Zip', url: 'https://www.7-zip.org/', category: 'Web Development', type: '[OS][F]', description: 'Free file archiver with high compression ratio.', learningCurve: 'Easy', alternativeTo: 'WinRAR', isFree: true, isOpenSource: true, tags: ['Utility', 'Archive', 'Open-Source'] },
  { name: 'PeaZip', url: 'https://peazip.github.io/', category: 'Web Development', type: '[OS][F]', description: 'Free Zip / Rar extractor.', learningCurve: 'Easy', alternativeTo: 'WinRAR', isFree: true, isOpenSource: true, tags: ['Utility', 'Archive'] },
  { name: 'Rufus', url: 'https://rufus.ie/', category: 'Web Development', type: '[OS][F]', description: 'Create bootable USB drives the easy way.', learningCurve: 'Medium', alternativeTo: '', isFree: true, isOpenSource: true, tags: ['Utility', 'System'] },
  { name: 'Ventoy', url: 'https://www.ventoy.net/', category: 'Web Development', type: '[OS][F]', description: 'A new approach to creating bootable USB drives.', learningCurve: 'Medium', alternativeTo: 'Rufus', isFree: true, isOpenSource: true, tags: ['Utility', 'System', 'Open-Source'] }
];

// Avoid duplicating
bulkTools.forEach(newTool => {
   if(!tools.find(t => t.name.toLowerCase() === newTool.name.toLowerCase())) {
       tools.push(newTool);
   }
});

fs.writeFileSync('src/data/tools.json', JSON.stringify(tools, null, 2));
console.log('Added ' + bulkTools.length + ' alternative tools. Database is now deeply networked.');
