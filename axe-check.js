const { AxePuppeteer } = require('axe-puppeteer');
const path = require('path');
const fs = require('fs');

async function runAccessibilityCheck() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = path.join(__dirname, 'index.html');
  const fileUrl = `file://${filePath}`;
  await page.goto(fileUrl);
  const results = await new AxePuppeteer(page).analyze();
  await browser.close();

  const { violations } = results;
  let report = '## Accessibility Violations Check 🔎\n\n';

  if (violations.length === 0) {
    console.log('No accessibility violations found.');
    report += '### ✅ No accessibility violations found.\n\n';
  } else {
    console.log('Accessibility violations found:');
    report += '### ⏳ Accessibility violations found.\n\n';
    for (const violation of violations) {
      report += `#### ${violation.description}\n\n`;

      if (violation.impact === 'critical') {
        report +=
          '\n\n##### ❌ Critical accessibility violations found.\n\nSee comments below.\n\n';
        console.error('Critical accessibility violations found.');
        process.exitCode = 1; // Set exit code to indicate failure
      } else {
        report += '\n\n##### ✅ No critical accessibility violations found.\n\n';
      }

      report += `[${violation.help}](${violation.helpUrl})\n\n`;
      report += `- Impact: **${violation.impact}**\n\n`;
      report += `- Tags: ${violation.tags.map((tag) => `\`${tag}\``).join(', ')}\n\n`;
      let nodes = '';
      for (const node of violation.nodes) {
        nodes += `   1. **Node:** \`${node.html}\`, **Impact:** ${
          node.impact
        }\n\n       ${node.failureSummary.split('\n  ').join('\n\n      - ')}\n\n`;
      }
      report += `<details><summary>Click here for detailed report</summary>\n\n`;
      report += nodes;
      report += '</details>\n\n';
    }
  }
  fs.writeFileSync('accessibility_report.md', report, 'utf8');
  console.log('Accessibility report generated.');
}

runAccessibilityCheck();
