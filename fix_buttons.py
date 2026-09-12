import os
import re

src_dir = r'x:\Hackathon\frontend\src\pages'
added = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            def repl(match):
                global added
                tag = match.group(0)
                if 'onClick' not in tag and 'type="submit"' not in tag:
                    added += 1
                    return tag.replace('<button', '<button onClick={() => alert(\'Coming soon!\')}')
                return tag
            
            new_content = re.sub(r'<button\b[^>]*>', repl, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file}')

print(f'Total buttons updated: {added}')
