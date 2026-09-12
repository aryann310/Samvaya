import os

def fix_imports(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Fix the backslash quotes issue
                new_content = content.replace("\\'", "'")

                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_imports(os.path.join('backend', 'src'))
