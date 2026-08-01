import requests

BASE_URL = 'http://localhost:8000/api/v1'

def login(email, password, role):
    url = f'{BASE_URL}/auth/{role}/login'
    resp = requests.post(url, json={'email': email, 'password': password})
    if resp.status_code == 200:
        return resp.json()['access_token']
    else:
        print(f'Login failed for {email}: {resp.text}')
        return None

def get_doc_dashboard(token):
    resp = requests.get(f'{BASE_URL}/portals/doctor/dashboard', headers={'Authorization': f'Bearer {token}'})
    return resp.json()

def get_pat_dashboard(token):
    resp = requests.get(f'{BASE_URL}/portals/patient/summary', headers={'Authorization': f'Bearer {token}'})
    return resp.json()

# 1. Login Doc Smith
print('--- DR SMITH ---')
smith_token = login('smith@healthflow.ai', 'doctor123', 'doctor')
if smith_token:
    dash = get_doc_dashboard(smith_token)
    print('Patients for Smith:', len(dash.get('assigned_patients', [])))
    for p in dash.get('assigned_patients', []):
        print(f' - {p["name"]}')

# 2. Login Dr Elena (DOC-202)
print('--- DR ELENA ---')
elena_token = login('elena.rostova@metrohealth.org', 'doctor123', 'doctor')
if elena_token:
    dash = get_doc_dashboard(elena_token)
    print('Patients for Elena:', len(dash.get('assigned_patients', [])))
    for p in dash.get('assigned_patients', []):
        print(f' - {p["name"]}')

# 3. Login Alice
print('--- ALICE (Patient) ---')
alice_token = login('alice.johnson@example.com', 'patient123', 'patient')
if alice_token:
    dash = get_pat_dashboard(alice_token)
    print('Alice sees her profile:', dash.get('profile', {}).get('name'))

