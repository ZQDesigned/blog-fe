#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const BASELINE_PATH = path.join(ROOT, 'scripts', 'style-token-baseline.json');

const COLOR_PATTERNS = [
  /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
  /\brgba?\([^\)]*\)/g,
  /\bhsla?\([^\)]*\)/g,
  /(?<![$\w-])(?:color|background(?:-color)?|border(?:-color)?|box-shadow)\s*:\s*[^;]*(?:\bwhite\b|\bblack\b|\bred\b|\bblue\b|\bgreen\b|\borange\b|\byellow\b|\bpurple\b|\bpink\b|\bgray\b|\bgrey\b)/gi,
  /(?<![$\w-])(?:color|background(?:Color)?|border(?:Color)?|boxShadow)\s*:\s*['"](?:white|black|red|blue|green|orange|yellow|purple|pink|gray|grey)['"]/gi,
];

const ALLOWED_PATH_SEGMENTS = [
  'src/theme/',
  'src/utils/consoleEasterEgg.ts',
  'src/components/GameGo/types.ts',
  'src/components/GameGo/types.19.ts',
  'src/components/GameReversi/types.ts',
];

const ALLOWED_LINE_PATTERNS = [
  /https?:\/\//,
  /data:image\//,
  /eaglercraft/i,
];

const EXTS = new Set(['.ts', '.tsx', '.css']);

const args = process.argv.slice(2);
const writeBaseline = args.includes('--write-baseline');

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (EXTS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const shouldIgnorePath = (relativePath) => {
  return ALLOWED_PATH_SEGMENTS.some((segment) => relativePath.startsWith(segment));
};

const shouldIgnoreLine = (lineText) => {
  return ALLOWED_LINE_PATTERNS.some((pattern) => pattern.test(lineText));
};

const scanFile = (absolutePath) => {
  const relativePath = path.relative(ROOT, absolutePath).replace(/\\/g, '/');

  if (shouldIgnorePath(relativePath)) {
    return [];
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, index) => {
    if (shouldIgnoreLine(line)) {
      return;
    }

    COLOR_PATTERNS.forEach((pattern) => {
      const matches = line.match(pattern);
      if (!matches) {
        return;
      }

      matches.forEach((match) => {
        findings.push(`${relativePath}:${index + 1}:${match}`);
      });
    });
  });

  return findings;
};

const files = walk(SRC_DIR);
const currentEntries = Array.from(new Set(files.flatMap(scanFile))).sort();

if (writeBaseline) {
  const payload = {
    generatedAt: new Date().toISOString(),
    entries: currentEntries,
  };

  fs.writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`[style-token-lint] Baseline written: ${BASELINE_PATH}`);
  console.log(`[style-token-lint] Entries: ${currentEntries.length}`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE_PATH)) {
  console.error(`[style-token-lint] Missing baseline: ${BASELINE_PATH}`);
  console.error('[style-token-lint] Run `npm run lint:style-tokens:update-baseline` first.');
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const baselineEntries = new Set(Array.isArray(baseline.entries) ? baseline.entries : []);
const currentEntrySet = new Set(currentEntries);

const newlyIntroduced = currentEntries.filter((entry) => !baselineEntries.has(entry));
const removed = [...baselineEntries].filter((entry) => !currentEntrySet.has(entry));

if (newlyIntroduced.length > 0) {
  console.error('[style-token-lint] Found newly introduced style literals. Use tokens instead:');
  newlyIntroduced.slice(0, 200).forEach((entry) => console.error(`  - ${entry}`));
  if (newlyIntroduced.length > 200) {
    console.error(`  ... and ${newlyIntroduced.length - 200} more`);
  }
  process.exit(1);
}

if (removed.length > 0) {
  console.log(`[style-token-lint] Note: ${removed.length} baseline entries are no longer present.`);
  console.log('[style-token-lint] You may refresh baseline if this was intentional.');
}

console.log(`[style-token-lint] OK. Tracked entries: ${currentEntries.length}`);
