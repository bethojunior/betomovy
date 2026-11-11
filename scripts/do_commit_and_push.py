import subprocess
import sys

def run(cmd):
    print("Running:", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    print("STDOUT:", res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    if res.returncode != 0:
        print(f"FAILED with exit code {res.returncode}")
        sys.exit(res.returncode)

run(["git", "add", "mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/components/TariffWizard/index.tsx", ".do/app.yaml"])
run(["git", "commit", "-m", "fix(monitor): corrigir import de AiOutlineInfoCircle de react-icons/ai para build do vite na digitalocean"])
run(["git", "push", "origin", "main"])
print("ALL DONE SUCCESSFULLY")
