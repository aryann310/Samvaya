const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const replacements = [
  { search: /bg-white/g, replace: 'bg-card/70 backdrop-blur-md' },
  { search: /bg-\[#f4f5f8\]/g, replace: 'bg-background' },
  { search: /text-gray-900/g, replace: 'text-foreground' },
  { search: /text-gray-400/g, replace: 'text-muted-foreground' },
  { search: /text-gray-500/g, replace: 'text-muted-foreground' },
  { search: /text-gray-600/g, replace: 'text-muted-foreground' },
  { search: /text-gray-700/g, replace: 'text-foreground/80' },
  { search: /text-gray-800/g, replace: 'text-foreground' },
  { search: /border-gray-100\/90/g, replace: 'border-glass-border' },
  { search: /border-gray-100/g, replace: 'border-glass-border' },
  { search: /border-gray-200\/80/g, replace: 'border-glass-border' },
  { search: /border-gray-200\/60/g, replace: 'border-glass-border' },
  { search: /border-gray-200/g, replace: 'border-border' },
  { search: /shadow-\[0_2px_14px_rgba\(0,0,0,0\.02\)\]/g, replace: 'shadow-glass-shadow' },
  { search: /bg-gray-50/g, replace: 'bg-muted' },
  { search: /bg-gray-100/g, replace: 'bg-muted/80' },
  { search: /bg-gray-200/g, replace: 'bg-border' },
  { search: /bg-gray-300\/80/g, replace: 'bg-border/80' },
  { search: /text-gray-300/g, replace: 'text-muted-foreground/60' },
  { search: /border-gray-300/g, replace: 'border-border' },
  { search: /text-black/g, replace: 'text-foreground' },
  { search: /bg-gray-950/g, replace: 'bg-foreground' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
      }
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDir(pagesDir);
