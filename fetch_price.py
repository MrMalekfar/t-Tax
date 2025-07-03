import requests
import json
import os
from datetime import datetime

def fetch_gold_price():
    url = "https://www.tala.ir/ajax/price"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()

        gold_18k_price_string = data.get('gold', {}).get('gold_18k', {}).get('v')
        
        if gold_18k_price_string:
            gold_18k_price = float(gold_18k_price_string.replace(',', ''))
            
            # Prepare data to be saved
            price_data = {
                "gold_18k_toman": gold_18k_price,
                "timestamp": datetime.now().isoformat()
            }
            
            # Define the path for the JSON file in the repository
            output_dir = "data"
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, "gold-price.json")
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(price_data, f, ensure_ascii=False, indent=4)
            print(f"Gold price fetched and saved to {output_path}")
        else:
            print("Could not find 18k gold price in the response.")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching gold price: {e}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    fetch_gold_price()
