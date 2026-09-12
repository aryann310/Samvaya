import os
import re

pages_dir = os.path.join("src", "pages")
components_dir = os.path.join("src", "components")

replacements = [
    (r"bg-white", "bg-card/70 backdrop-blur-md"),
    (r"bg-\[#f4f5f8\]", "bg-background"),
    (r"text-gray-900", "text-foreground"),
    (r"text-gray-400", "text-muted-foreground"),
    (r"text-gray-500", "text-muted-foreground"),
    (r"text-gray-600", "text-muted-foreground"),
    (r"text-gray-700", "text-foreground/80"),
    (r"text-gray-800", "text-foreground"),
    (r"border-gray-100/90", "border-glass-border"),
    (r"border-gray-100", "border-glass-border"),
    (r"border-gray-200/80", "border-glass-border"),
    (r"border-gray-200/60", "border-glass-border"),
    (r"border-gray-200", "border-border"),
    (r"shadow-\[0_2px_14px_rgba\(0,0,0,0\.02\)\]", "shadow-glass-shadow"),
    (r"bg-gray-50", "bg-muted"),
    (r"bg-gray-100", "bg-muted/80"),
    (r"bg-gray-200", "bg-border"),
    (r"bg-gray-300/80", "bg-border/80"),
    (r"text-gray-300", "text-muted-foreground/60"),
    (r"border-gray-300", "border-border"),
    (r"text-black", "text-foreground"),
    (r"bg-gray-950", "bg-foreground"),
]

def process_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original = content
                for search, replace in replacements:
                    content = re.sub(search, replace, content)
                
                if content != original:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Updated {file}")

if __name__ == "__main__":
    process_dir(pages_dir)
    process_dir(components_dir)
