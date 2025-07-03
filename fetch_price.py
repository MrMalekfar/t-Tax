import requests
import json
import os
from datetime import datetime

def fetch_gold_price():
    url = "https://www.tala.ir/ajax/price"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    print(f"Attempting to fetch data from: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        print(f"Successfully fetched data. Status Code: {response.status_code}")
        print(f"Response content (first 500 chars): {response.text[:500]}...")
        
        data = response.json()
        print(f"Parsed JSON data successfully. Top-level keys: {list(data.keys())}") # DEBUG: Show top-level keys

        # Debugging the path step-by-step
        gold_data = data.get('gold')
        if gold_data is None:
            print("DEBUG: 'gold' key not found in response.")
            print(f"Full JSON data received: {json.dumps(data, indent=2)}") # Essential if 'gold' is missing
            gold_18k_price_string = None # Ensure it's None to trigger the else block
        else:
            print(f"DEBUG: 'gold' key found. Its keys: {list(gold_data.keys())}") # DEBUG: Show keys under 'gold'
            gold_18k_section = gold_data.get('gold_18k')
            if gold_18k_section is None:
                print("DEBUG: 'gold_18k' key not found under 'gold'.")
                gold_18k_price_string = None
            else:
                print(f"DEBUG: 'gold_18k' key found. Its keys: {list(gold_18k_section.keys())}") # DEBUG: Show keys under 'gold_18k'
                gold_18k_price_string = gold_18k_section.get('v')
                if gold_18k_price_string is None:
                    print("DEBUG: 'v' key not found under 'gold_18k'.")
                else:
                    print(f"DEBUG: Successfully found 'v' key with value: {gold_18k_price_string}")


        if gold_18k_price_string:
            gold_18k_price = float(gold_18k_price_string.replace(',', ''))
            
            price_data = {
                "gold_18k_toman": gold_18k_price,
                "timestamp": datetime.now().isoformat()
            }
            
            output_dir = "data"
            output_path = os.path.join(output_dir, "gold-price.json")
            
            print(f"Checking if directory exists: {os.path.abspath(output_dir)}")
            os.makedirs(output_dir, exist_ok=True)
            print(f"Directory '{output_dir}' ensured.")
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(price_data, f, ensure_ascii=False, indent=4)
            print(f"Gold price fetched and saved to {os.path.abspath(output_path)}")
        else:
            # This block will now only be reached if gold_18k_price_string is actually None
            print("Could not find 18k gold price in the response. Check debug messages above for details.")
            # Full JSON data is printed above if 'gold' key is missing.
            # If 'gold' is present but 'gold_18k' or 'v' are missing, the specific debug message will tell us.
            
    except requests.exceptions.Timeout:
        print("Error: Request timed out.")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching gold price (network/HTTP issue): {e}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}. Raw response (first 500 chars): {response.text[:500]}...")
    except Exception as e:
        print(f"An unexpected error occurred during price processing: {e}")

if __name__ == "__main__":
    fetch_gold_price()
