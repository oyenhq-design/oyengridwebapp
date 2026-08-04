const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);
const startIdx = lines.findIndex(l => l.includes('── Workspace Chat System ──'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('const [verifyOrgNameInput'));
const insertIdx = lines.findIndex((l, i) => i > endIdx && l.includes('Sync team and invitations to localStorage'));

console.log('Start:', startIdx, 'End:', endIdx, 'Insert:', insertIdx);

if (startIdx !== -1 && endIdx !== -1 && insertIdx !== -1) {
    const chunk = lines.splice(startIdx, endIdx - startIdx);
    // after splice, the array is smaller, so insertIdx has shifted by the chunk length
    const newInsertIdx = insertIdx - chunk.length;
    lines.splice(newInsertIdx, 0, ...chunk);
    fs.writeFileSync('src/App.jsx', lines.join('\n'));
    console.log('Successfully moved the chunk!');
} else {
    console.log('Failed to find indices');
}
