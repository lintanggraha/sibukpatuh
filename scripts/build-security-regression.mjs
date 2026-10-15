import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

export function assertSafeHtml(html, filename = 'HTML') {
  for (const tag of html.match(/<(?:link|script)\b[^>]*>/gi) || []) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)]
      .map((match) => [match[1].toLowerCase(), match[2]]));
    const executable = /^<script\b/i.test(tag) || attributes.rel === 'modulepreload'
      || (attributes.rel === 'preload' && attributes.as === 'script');
    if (!executable) continue;
    const url = attributes.src || attributes.href;
    if (!url) continue;
    assert.ok(!/^data:/i.test(url), `${filename}: script source tidak boleh berupa data URI`);
    assert.ok(!/(?:^|\/)src\//.test(url), `${filename}: referensi source /src/ masih terekspos`);
    if (url.startsWith('/assets/')) {
      assert.ok(existsSync(resolve('dist', url.slice(1))), `${filename}: asset build tidak ditemukan: ${url}`);
    }
  }
}

// Pastikan pemeriksaan menangkap regresi preload sebelum memeriksa output sebenarnya.
assert.throws(() => assertSafeHtml('<link rel="preload" as="script" href="data:text/javascript;base64,YQ==">'));
assert.throws(() => assertSafeHtml('<link rel="preload" as="script" href="/src/main.js">'));
assert.ok(existsSync('dist/index.html'), 'Jalankan build sebelum pemeriksaan output.');
const files = filesUnder('dist');
assert.ok(!files.some((path) => path.endsWith('.map')), 'Source map tidak boleh diterbitkan ke dist publik.');
const pages = files.filter((path) => path.endsWith('.html'));
assert.ok(pages.length > 1, 'Halaman prerender tidak ditemukan.');
for (const file of pages) assertSafeHtml(readFileSync(file, 'utf8'), file);

// Pertahankan pola penggunaan AI yang on-demand: bukan chatbot dan bukan saat feed CVE diambil.
const intel = readFileSync('src/views/IntelligenceCenter.vue', 'utf8');
for (const chatMarker of ['CVE AI Analyst', 'sendAiQuery', 'chatArea', 'Tanya tentang CVE ini']) {
  assert.ok(!intel.includes(chatMarker), `Chatbot CVE tidak boleh aktif: ${chatMarker}`);
}
assert.equal((intel.match(/\/api\/gemini/g) || []).length, 1, 'Gemini hanya boleh dipanggil oleh analisis CVE on-demand.');
const feedLoader = intel.split('async fetchCisaKEV() {')[1]?.split('setCisaMockData()')[0] || '';
assert.ok(feedLoader && !feedLoader.includes('loadCveAnalysis'), 'Pengambilan feed CISA tidak boleh memanggil AI.');
const clickHandler = intel.split('toggleCveExpand(cve) {')[1]?.split('async enrichCve(cve)')[0] || '';
assert.ok(clickHandler.includes('this.loadCveAnalysis(cve);'), 'Analisis AI harus dimulai saat pengguna membuka CVE.');
assert.ok(!intel.includes('selectedCve = this.cves[0]'), 'CVE tidak boleh dipilih otomatis saat feed dimuat.');

console.log(`Pemeriksaan source frontend lulus: ${pages.length} halaman tanpa source mentah/source map publik; chatbot dihapus dan analisis AI hanya on-demand saat CVE dibuka.`);
