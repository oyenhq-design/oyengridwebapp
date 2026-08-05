const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace visible texts (case sensitive mostly)
  newContent = newContent.replace(/'Learners'/g, "'Participants'");
  newContent = newContent.replace(/"Learners"/g, '"Participants"');
  newContent = newContent.replace(/'Learner'/g, "'Participant'");
  newContent = newContent.replace(/"Learner"/g, '"Participant"');
  newContent = newContent.replace(/>Learners</g, '>Participants<');
  newContent = newContent.replace(/>Learner</g, '>Participant<');
  newContent = newContent.replace(/Total Learners/g, 'Total Participants');
  newContent = newContent.replace(/Active Learners/g, 'Active Participants');
  newContent = newContent.replace(/Inactive Learners/g, 'Inactive Participants');
  newContent = newContent.replace(/Invite Learner/g, 'Invite Participant');
  newContent = newContent.replace(/No learners yet/g, 'No participants yet');
  newContent = newContent.replace(/No learner/g, 'No participant');
  newContent = newContent.replace(/Search learners/g, 'Search participants');
  newContent = newContent.replace(/learners enrolled/g, 'participants enrolled');
  newContent = newContent.replace(/learner submission/g, 'participant submission');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
    console.log('Modified: ' + file);
  }
});

console.log('Modified ' + modifiedCount + ' files.');
