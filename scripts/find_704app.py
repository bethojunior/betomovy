import os

target = '704app.com.br'
matches = []

dirs_to_scan = [
    'mobilidade-api-php-master',
    'mobilidade-central-master',
    'mobilidade-monitor-new-main',
    'mobility-pro-app-rota101-pro/src',
    'mobilidade-api-node-main'
]

skip_dirs = {
    'node_modules', '.git', 'dist', 'build', '.gradle', 'Pods', 'vendor',
    'storage', 'cache', '.system_generated', 'brain'
}

extensions = ('.php', '.js', '.ts', '.tsx', '.json', '.env', '.example', '.html', '.css', '.vue', '.xml')

for base_dir in dirs_to_scan:
    if not os.path.exists(base_dir):
        continue
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if f.endswith(extensions) or f.startswith('.env'):
                p = os.path.join(root, f)
                try:
                    with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                        for idx, line in enumerate(fl):
                            if target in line:
                                matches.append((p, idx + 1, line.strip()))
                except Exception:
                    pass

print(f"Total matches found: {len(matches)}")
with open('matches_704app.txt', 'w', encoding='utf-8') as out:
    for p, lnum, line in matches:
        out.write(f"{p}:{lnum}:{line}\n")
        print(f"{p}:{lnum} -> {line[:120]}")
