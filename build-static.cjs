// Publish only browser assets; Python sources and local settings stay private.
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'public');
fs.mkdirSync(output, { recursive: true });
// Remove retired player assets from an existing local build as well.
for (const retired of ['music.css', 'music.js', 'music-services.js']) {
  fs.rmSync(path.join(output, retired), {force:true});
}
for (const file of [
  'index.html', 'style.css', 'script.js', 'weather.css', 'weather.js',
  'languages.js', 'languages.css',
  'dcmd-enhance.css', 'dcmd-enhance.js', 'dcmd-system.css', 'dcmd-editorial.css',
  'dcmd-reference.css', 'dcmd-reference.js',
  'data', 'images', 'vendor', 'policies', 'commerce.js'
]) {
  fs.cpSync(path.join(__dirname, file), path.join(output, file), { recursive: true });
}
