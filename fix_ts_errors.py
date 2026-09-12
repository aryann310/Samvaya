import os
import re

def fix_errors(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                
                # Replace req.params.businessId with req.params.businessId as string
                content = re.sub(
                    r'(req\.params\.businessId)(?! as string)',
                    r'\1 as string',
                    content
                )
                
                # Replace req.params.itemId with req.params.itemId as string
                content = re.sub(
                    r'(req\.params\.itemId)(?! as string)',
                    r'\1 as string',
                    content
                )

                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)

if __name__ == "__main__":
    fix_errors(os.path.join('backend', 'src', 'controllers'))
