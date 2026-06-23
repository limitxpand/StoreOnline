import os
import time
import requests
import re
import urllib.request
import subprocess
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile

# --- CONFIGURATION ---
API_BASE_URL = "https://store-online-market-git-main-limit-xpand.vercel.app"  # Update to production URL if needed
WORKER_TOKEN = "super_secret_worker_token_123"

# Appwrite Setup
APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID = "YOUR_APPWRITE_PROJECT_ID" # Fill this
APPWRITE_API_KEY = "YOUR_APPWRITE_API_KEY"       # Fill this
APPWRITE_BUCKET_ID = "products_bucket"

# Paths
METAEDITOR_PATH = r"C:\Program Files\MetaTrader 5\metaeditor64.exe" # User must adjust this
WORKSPACE_DIR = os.path.join(os.getcwd(), "compile_workspace")
INDICATOR_INJECT_FILE = os.path.join(os.getcwd(), "..", "Indicator Injection format.txt")
EA_INJECT_FILE = os.path.join(os.getcwd(), "..", "EA Injection format.txt")

# Initialize Appwrite
client = Client()
client.set_endpoint(APPWRITE_ENDPOINT)
client.set_project(APPWRITE_PROJECT_ID)
client.set_key(APPWRITE_API_KEY)
storage = Storage(client)

if not os.path.exists(WORKSPACE_DIR):
    os.makedirs(WORKSPACE_DIR)

def get_jobs():
    try:
        headers = {"Authorization": f"Bearer {WORKER_TOKEN}"}
        res = requests.get(f"{API_BASE_URL}/api/worker/compile-jobs", headers=headers)
        if res.status_code == 200:
            return res.json().get("jobs", [])
        else:
            print(f"Failed to fetch jobs: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Error fetching jobs: {e}")
    return []

def download_file(url, dest):
    print(f"Downloading {url} to {dest}...")
    urllib.request.urlretrieve(url, dest)

def inject_code(source_path, product_title):
    print(f"Injecting code for {product_title}...")
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        code = f.read()

    is_indicator = "indicator" in product_title.lower()
    inject_template_path = INDICATOR_INJECT_FILE if is_indicator else EA_INJECT_FILE
    
    with open(inject_template_path, 'r', encoding='utf-8') as f:
        injection_code = f.read()

    # Step 1: Replace EA_Name = "new i" or "new ea" with the actual title
    injection_code = re.sub(r'(string EA_Name = )"[^"]+";', rf'\1"{product_title}";', injection_code)

    # Step 2: Rename existing standard functions to avoid collision
    # Regex to find `int OnInit()` or `void OnTick()` and rename them
    replacements = {
        r'(\bint\s+)OnInit(\s*\()': r'\1Original_OnInit\2',
        r'(\bvoid\s+)OnDeinit(\s*\()': r'\1Original_OnDeinit\2',
        r'(\bvoid\s+)OnTick(\s*\()': r'\1Original_OnTick\2',
        r'(\bint\s+)OnCalculate(\s*\()': r'\1Original_OnCalculate\2',
        r'(\bvoid\s+)OnChartEvent(\s*\()': r'\1Original_OnChartEvent\2'
    }

    # Track which functions were present so we know if we need to call them from the injected block
    functions_found = {}

    for pattern, replacement in replacements.items():
        original_count = len(re.findall(pattern, code))
        if original_count > 0:
            functions_found[replacement.split('\\')[1].replace('Original_', '')] = True
            code = re.sub(pattern, replacement, code)

    # Step 3: Modify the injected template to call the original functions if they existed
    if "OnInit" in functions_found:
        injection_code = re.sub(r'(return\(INIT_SUCCEEDED\);)(\s*\n\s*})', r'return Original_OnInit();\2', injection_code)
    
    if "OnDeinit" in functions_found:
        injection_code = re.sub(r'(ObjectDelete[^;]+;)(\s*\n\s*})', r'\1\n   Original_OnDeinit(reason);\2', injection_code)
    
    if "OnTick" in functions_found:
        injection_code = re.sub(r'(if\(!is_license_valid\) return;)(\s*\n\s*})', r'\1\n   Original_OnTick();\2', injection_code)
        
    if "OnCalculate" in functions_found:
        injection_code = re.sub(r'(if\(!is_license_valid\) return\(0\);)(\s*\n\s*return\(rates_total\);\s*})', r'\1\n   return Original_OnCalculate(rates_total, prev_calculated, time, open, high, low, close, tick_volume, volume, spread);\2', injection_code)

    if "OnChartEvent" in functions_found:
        injection_code = re.sub(r'(if \(HandleChatEvents\(id, lparam, dparam, sparam\)\) return;)(\s*\n\s*})', r'\1\n   Original_OnChartEvent(id, lparam, dparam, sparam);\2', injection_code)

    # Step 4: Append the injected code to the bottom
    final_code = code + "\n\n" + injection_code
    
    with open(source_path, 'w', encoding='utf-8') as f:
        f.write(final_code)
    
    print("Injection complete.")

def compile_mql5(source_path):
    print(f"Compiling {source_path}...")
    log_path = source_path.replace(".mq5", ".log")
    
    cmd = f'"{METAEDITOR_PATH}" /compile:"{source_path}" /log:"{log_path}"'
    subprocess.run(cmd, shell=True)
    
    ex5_path = source_path.replace(".mq5", ".ex5")
    if os.path.exists(ex5_path):
        print(f"Compilation Successful: {ex5_path}")
        return ex5_path
    else:
        print("Compilation Failed. Check log:")
        if os.path.exists(log_path):
            with open(log_path, 'r', encoding='utf-16', errors='ignore') as f:
                print(f.read())
        return None

def upload_to_appwrite(file_path):
    print("Uploading to Appwrite...")
    filename = os.path.basename(file_path)
    result = storage.create_file(
        bucket_id=APPWRITE_BUCKET_ID,
        file_id='unique()',
        file=InputFile.from_path(file_path)
    )
    
    file_id = result['$id']
    file_url = f"{APPWRITE_ENDPOINT}/storage/buckets/{APPWRITE_BUCKET_ID}/files/{file_id}/download?project={APPWRITE_PROJECT_ID}"
    return file_url

def update_product_status(product_id, ex5_url):
    print("Updating product status via API...")
    url = f"{API_BASE_URL}/api/admin/pending-products/{product_id}/approve"
    headers = {"Authorization": f"Bearer {WORKER_TOKEN}"}
    
    # We simulate a manual approval but pass the Appwrite URL
    # Wait, the Next.js API expects a file upload. 
    # Let's hit the endpoint and pass the URL directly instead.
    data = {
        "isAuto": "false",
        "worker_override": "true",
        "compiledFileUrl": ex5_url
    }
    
    res = requests.post(url, headers=headers, data=data)
    if res.status_code == 200:
        print(f"Product {product_id} successfully published.")
    else:
        print(f"Failed to publish {product_id}: {res.text}")


def main():
    print("Auto Compile Worker Started. Waiting for jobs...")
    while True:
        jobs = get_jobs()
        for job in jobs:
            print(f"Found job: {job['title']} (ID: {job['id']})")
            if 'mq5' not in job['sourceFileUrl'].lower():
                print("Not an MQ5 file, skipping.")
                # Ideally, update status back to pending or error
                continue
            
            source_filename = f"{job['id']}.mq5"
            source_path = os.path.join(WORKSPACE_DIR, source_filename)
            
            try:
                download_file(job['sourceFileUrl'], source_path)
                inject_code(source_path, job['title'])
                ex5_path = compile_mql5(source_path)
                
                if ex5_path:
                    ex5_url = upload_to_appwrite(ex5_path)
                    update_product_status(job['id'], ex5_url)
                else:
                    print("Failed to compile, moving on.")
                    
            except Exception as e:
                print(f"Error processing job {job['id']}: {e}")
                
        time.sleep(10) # Poll every 10 seconds

if __name__ == "__main__":
    main()
