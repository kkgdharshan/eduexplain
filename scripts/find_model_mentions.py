import os
from collections import defaultdict

patterns = ['Random Forest', 'RandomForest', 'TreeSHAP', 'SHAP']

file_matches = defaultdict(list)
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.git', '.gemini', 'dist', 'venv', 'scripts', '.system_generated']):
        continue
    for f in files:
        if f.endswith(('.tsx', '.ts', '.py', '.json', '.html', '.md')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                for idx, line in enumerate(fp, 1):
                    for pat in patterns:
                        if pat.lower() in line.lower():
                            file_matches[p].append((idx, pat, line.strip()))
                            break

print(f"Total files with matches: {len(file_matches)}")
for filepath, matches in file_matches.items():
    print(f"{filepath}: {len(matches)} matches")
    for idx, pat, line in matches[:5]:
        safe_line = line[:80].encode('ascii', 'replace').decode('ascii')
        print(f"   L{idx} [{pat}]: {safe_line}")
    if len(matches) > 5:
        print(f"   ... and {len(matches) - 5} more")
