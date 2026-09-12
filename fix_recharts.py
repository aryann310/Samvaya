import os

def fix_recharts(dir_path):
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                
                # Replace (val: number) => with (val: any) =>
                content = content.replace("(val: number) =>", "(val: any) =>")

                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)

if __name__ == "__main__":
    fix_recharts(os.path.join('frontend', 'src', 'pages'))
