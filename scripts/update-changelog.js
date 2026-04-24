import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHANGELOG_PATH = path.resolve('CHANGELOG.md');

// Function to get git logs since last update (or all if not found)
function getGitLogs() {
  try {
    // Format: hash | date | subject
    const logs = execSync('git log --pretty=format:"%h|%ad|%s" --date=short -n 50').toString().trim();
    return logs.split('\n').map(line => {
      const [hash, date, subject] = line.split('|');
      return { hash, date, subject };
    });
  } catch (error) {
    console.error('Failed to get git logs:', error.message);
    return [];
  }
}

function updateChangelog() {
  const logs = getGitLogs();
  if (logs.length === 0) return;

  let content = '# 📜 Changelog\n\nSemua perubahan signifikan pada proyek **SibukPatuh** akan dicatat di file ini.\n\n';
  
  // Group by date
  const groups = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    content += `## [${date}]\n\n`;
    groups[date].forEach(log => {
      // Basic categorization based on prefix
      let subject = log.subject;
      if (subject.toLowerCase().startsWith('feat')) {
        content += `- ✨ **Feature:** ${subject}\n`;
      } else if (subject.toLowerCase().startsWith('fix')) {
        content += `- 🛠️ **Fix:** ${subject}\n`;
      } else if (subject.toLowerCase().startsWith('style') || subject.toLowerCase().startsWith('ui')) {
        content += `- 🎨 **UI/UX:** ${subject}\n`;
      } else if (subject.toLowerCase().startsWith('docs')) {
        content += `- 📚 **Docs:** ${subject}\n`;
      } else {
        content += `- 🔄 ${subject}\n`;
      }
    });
    content += '\n';
  });

  content += `---\n*Auto-generated on: ${new Date().toISOString().split('T')[0]}*\n`;

  fs.writeFileSync(CHANGELOG_PATH, content);
  console.log('✅ CHANGELOG.md has been updated!');
}

updateChangelog();
