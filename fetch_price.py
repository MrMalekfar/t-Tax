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
        response.raise_for_status() #
        
        print(f"Successfully fetched data. Status Code: {response.status_code}")
       
        
        data = response.json()
        print(f"Parsed JSON data successfully. Top-level keys: {list(data.keys())}")

        
        extracted_prices = {}

        gold_18k_price_string = data.get('gold', {}).get('gold_18k', {}).get('v')
        if gold_18k_price_string:
            gold_18k_price = float(gold_18k_price_string.replace(',', ''))
            extracted_prices["gold_18k_toman"] = gold_18k_price
            print(f"DEBUG: Successfully found 18k Gold 'v' key with value: {gold_18k_price_string}")
        else:
            print("WARNING: Could not find 18k gold price.")
            

       
        dollar_price_string = data.get('arz', {}).get('arz_dolar', {}).get('v')
        if dollar_price_string and dollar_price_string != "0": 
            dollar_price = float(dollar_price_string.replace(',', ''))
            extracted_prices["dollar_toman"] = dollar_price
            print(f"DEBUG: Successfully found Dollar 'v' key with value: {dollar_price_string}")
        else:
            print("WARNING: Could not find Dollar price or it was zero.")
            
        sekke_jad_price_string = data.get('sekke', {}).get('sekke-jad', {}).get('v')
        if sekke_jad_price_string and sekke_jad_price_string != "0":
            sekke_jad_price = float(sekke_jad_price_string.replace(',', ''))
            extracted_prices["sekke_jadid_toman"] = sekke_jad_price
            print(f"DEBUG: Successfully found Sekke Jadid 'v' key with value: {sekke_jad_price_string}")
        else:
            print("WARNING: Could not find Sekke Jadid price or it was zero.")

        # --- Extract Sekke Nim (Half Coin) Price ---
        sekke_nim_price_string = data.get('sekke', {}).get('sekke-nim', {}).get('v')
        if sekke_nim_price_string and sekke_nim_price_string != "0":
            sekke_nim_price = float(sekke_nim_price_string.replace(',', ''))
            extracted_prices["sekke_nim_toman"] = sekke_nim_price
            print(f"DEBUG: Successfully found Sekke Nim 'v' key with value: {sekke_nim_price_string}")
        else:
            print("WARNING: Could not find Sekke Nim price or it was zero.")

        # --- Extract Sekke Rob (Quarter Coin) Price ---
        sekke_rob_price_string = data.get('sekke', {}).get('sekke-rob', {}).get('v')
        if sekke_rob_price_string and sekke_rob_price_string != "0":
            sekke_rob_price = float(sekke_rob_price_string.replace(',', ''))
            extracted_prices["sekke_rob_toman"] = sekke_rob_price
            print(f"DEBUG: Successfully found Sekke Rob 'v' key with value: {sekke_rob_price_string}")
        else:
            print("WARNING: Could not find Sekke Rob price or it was zero.")

        gold_mesghal_price_string = data.get('gold', {}).get('gold_mesghal_usd', {}).get('v')
        if gold_mesghal_price_string and gold_mesghal_price_string != "0":
            gold_mesghal_price = float(gold_mesghal_price_string.replace(',', ''))
            extracted_prices["gold_mesghal_toman"] = gold_mesghal_price
            print(f"DEBUG: Successfully found Gold Mesghal 'v' key with value: {gold_mesghal_price_string}")
        else:
            print("WARNING: Could not find Gold Mesghal price or it was zero.")

        gold_ounce_price_string = data.get('gold', {}).get('gold_ounce', {}).get('v')
        if gold_ounce_price_string and gold_ounce_price_string != "0":
            gold_ounce_price = float(gold_ounce_price_string.replace(',', ''))
            extracted_prices["gold_ounce_Dollar"] = gold_ounce_price
            print(f"DEBUG: Successfully found Gold Ounce 'v' key with value: {gold_ounce_price_string}")
        else:
            print("WARNING: Could not find Gold Ounce price or it was zero.")



        if extracted_prices:
            extracted_prices["timestamp"] = datetime.now().isoformat()
            
            output_dir = "data"
            output_path = os.path.join(output_dir, "gold-price.json")
            
            print(f"Checking if directory exists: {os.path.abspath(output_dir)}")
            os.makedirs(output_dir, exist_ok=True)
            print(f"Directory '{output_dir}' ensured.")
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(extracted_prices, f, ensure_ascii=False, indent=5)
            print(f"All prices fetched and saved to {os.path.abspath(output_path)}")
        else:
            print("No prices were extracted from the response. Skipping file save.")
            print(f"Full JSON data received: {json.dumps(data, indent=2)}") 
            
    except requests.exceptions.Timeout:
        print("Error: Request timed out.")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data (network/HTTP issue): {e}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}. Raw response (first 500 chars): {response.text[:500]}...")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    fetch_gold_price()
