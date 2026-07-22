const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'src', 'App.jsx');
let content = fs.readFileSync(appJsxPath, 'utf8');

const targetImports = `import { getProgramsForUser, getSessionsForUser, getLearnersForUser, getInboxForUser } from './domain/workspace/selectors';
import { updateSessionStatus } from './domain/workspace/actions';`;

const replacementImports = `import getProgramsForUser from './domain/workspace/selectors/getProgramsForUser';
import getSessionsForUser from './domain/workspace/selectors/getSessionsForUser';
import getLearnersForUser from './domain/workspace/selectors/getLearnersForUser';
import getInboxForUser from './domain/workspace/selectors/getInboxForUser';
import updateSessionStatus from './domain/workspace/actions/updateSessionStatus';`;

// Normalize line endings
content = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetImports.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementImports.replace(/\r\n/g, '\n');

if (content.includes(normalizedTarget)) {
  content = content.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(appJsxPath, content, 'utf8');
  console.log("Successfully switched to direct imports in App.jsx!");
} else {
  console.error("Target imports not found in App.jsx!");
  process.exit(1);
}
