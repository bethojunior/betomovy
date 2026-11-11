import urllib.request, json, time

timestamp = int(time.time())
print(f"Waiting for new commit deploy... Current timestamp: {timestamp}")

for i in range(1, 30):
    time.sleep(10)
    test_email = f"deploy_test_{int(time.time())}@example.com"
    cust_payload = {
        'stdObject': [{
            'name': 'Deploy Check',
            'email': test_email,
            'document': f'99988{int(time.time()) % 10000}',
            'dateOfBirth': '1998-05-20',
            'nickname': 'Deploy',
            'registered_in': 'mobilidade',
            'phone': f'55119999{int(time.time()) % 10000}',
            'password': 'password123',
            'cityId': 5605
        }]
    }

    data = json.dumps(cust_payload).encode('utf-8')
    req = urllib.request.Request('https://api.movymob.com/Customer/Register', data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            res = json.loads(body)
            msg = res.get('message', '')
            status = res.get('status', False)
            print(f"[Attempt {i}] status={status}, message={msg}")
            if 'getIdCustomer' not in msg:
                print(">>> NEW DEPLOY DETECTED! Customer/Register is working!")
                print("Result data:", res.get('data'))
                break
    except Exception as e:
        print(f"[Attempt {i}] Error: {e}")
