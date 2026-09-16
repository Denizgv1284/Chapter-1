// Publish only browser assets; Python sources and local settings stay private.
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'public');
fs.mkdirSync(output, { recursive: true });
for (const file of [
  'index.html', 'style.css', 'script.js', 'weather.css', 'weather.js',
  'music.css', 'music.js', 'music-services.js', 'languages.js', 'languages.css',
  'data', 'images', 'vendor', 'policies', 'commerce.js'
]) {
  fs.cpSync(path.join(__dirname, file), path.join(output, file), { recursive: true });
}
