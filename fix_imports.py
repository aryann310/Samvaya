import os
import re

def fix_imports(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Add .js to relative imports
                # e.g. import foo from './bar' -> import foo from './bar.js'
                # Do not match lines that already have .js or .json or .css etc.
                content = re.sub(
                    r'(import\s+.*?\s+from\s+[\'"]\.[^\'"]+)(?<!\.js)(?<!\.json)(?<!\.ts)([\'"])',
                    r'\1.js\2',
                    content
                )

                # Replace import { Request, Response } with import type { Request, Response }
                content = re.sub(
                    r'import\s+\{\s*Request\s*,\s*Response\s*\}\s+from\s+[\'"]express[\'"]',
                    r'import type { Request, Response } from \'express\'',
                    content
                )

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

if __name__ == "__main__":
    fix_imports(os.path.join('backend', 'src'))
