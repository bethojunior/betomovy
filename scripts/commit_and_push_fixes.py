import subprocess
import os

os.chdir("D:/APLICATIVO MOVY")

def run(cmd):
    print("Running:", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    print("STDOUT:", res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    return res.returncode

run(["git", "add", 
     "mobilidade-api-php-master/app/controllers/Config_app_partnersController.php",
     "mobilidade-api-php-master/app/controllers/ConfigAppPartnersController.php",
     "mobilidade-api-php-master/app/controllers/CustomerController.php",
     "mobilidade-api-php-master/app/controllers/TripController.php",
     "mobilidade-api-php-master/app/utils/RouteListener.php"])

run(["git", "commit", "-m", "fix(api): ConfigAppPartners CRUD and sync trip cancellation release"])
run(["git", "push", "origin", "main"])
print("PUSH COMPLETE")
