// Function to get a number value from an input field, defaulting if not found or invalid
function getInputValue(id, defaultValue) {
    const element = document.getElementById(id);
    let value = parseFloat(element.value);
    if (isNaN(value)) {
        value = defaultValue;
        element.value = defaultValue; // Set the input field to the default if invalid
    }
    return value;
}

// Function to set a number value to an input field and localStorage
function setInputValueAndLocalStorage(id, value) {
    document.getElementById(id).value = value;
    localStorage.setItem(id, value);
}

// Function to load values from localStorage when the page loads
function loadValuesFromLocalStorage() {
    // We can set default values directly in the HTML or here if we prefer JS to manage them
    document.getElementById('profit').value = localStorage.getItem('profit') || '5';
    document.getElementById('wage').value = localStorage.getItem('wage') || '5';
    document.getElementById('VAT').value = localStorage.getItem('VAT') || '10'; // Value Added Tax
    document.getElementById('price_gram').value = localStorage.getItem('price_gram') || '68000000';
    document.getElementById('price_whole').value = localStorage.getItem('price_whole') || '0'; // Added price_whole to localStorage
    document.getElementById('Final-Price').value = localStorage.getItem('Final-Price') || '50';
}

// Function to perform the calculation and update the display
function calculateAndSave() {
    // Get values from input fields
    let profit = getInputValue('profit', 5);
    let wage = getInputValue('wage', 5);
    let price_gram = getInputValue('price_gram', 68000000);
    let price_whole = getInputValue('price_whole', 0); // Get price_whole from input
    let final_price = getInputValue('Final-Price', 50);

    // Save current values to localStorage
    setInputValueAndLocalStorage('profit', profit);
    setInputValueAndLocalStorage('wage', wage);
    setInputValueAndLocalStorage('price_gram', price_gram);
    setInputValueAndLocalStorage('price_whole', price_whole); // Save price_whole
    setInputValueAndLocalStorage('Final-Price', final_price);

    // --- Core Calculation for Weight ---
    // Ensure that the taxless_price_geram is not zero to prevent errors
    let Raw_gold_price = price_gram * weight;
    
    let taxless_price_geram = price_gram + (0.01 * wage * price_gram) + ((price_gram + (0.01 * wage * price_gram)) * profit / 100);
    let  taxless_price = taxless_price_geram * weight;
    let taxe = (taxless_price - Raw_gold_price) * VAT / 100;
    let weight = 0;
    if (taxless_price_geram !== 0) {
        weight = price_whole / taxless_price_geram;
    } else {
        console.warn("taxless_price_geram is zero, cannot calculate weight.");
    }
    // --- End Core Calculation ---

    // --- Tax Calculation (assuming 10% of Final-Price for now) ---
    const Tax_10_Rate = 0.1;
    let calculatedTax = final_price * Tax_10_Rate;
    let priceAfterTax = final_price - calculatedTax; // Simple deduction for now

    // Update the display
    document.getElementById('display-weight').textContent = weight.toFixed(4); // Display weight with 4 decimal places
    document.getElementById('display-tax').textContent = calculatedTax.toFixed(2);
    document.getElementById('display-price-after-tax').textContent = priceAfterTax.toFixed(2);
    document.getElementById('display-raw-gold-price').textContent = Raw_gold_price.toFixed(2);

    // --- Where to "reduce the tax based on weight"? ---
    // This is the part that needs your input. For example:
    // If weight *some_factor* reduces the tax:
    // let taxReduction = weight * 0.05; // Example: 5 cents reduction per unit of weight
    // calculatedTax = Math.max(0, calculatedTax - taxReduction); // Ensure tax doesn't go below 0
    // priceAfterTax = final_price - calculatedTax;
    // document.getElementById('display-tax').textContent = calculatedTax.toFixed(2);
    // document.getElementById('display-price-after-tax').textContent = priceAfterTax.toFixed(2);
}

// Load values when the script loads (i.e., when the page loads)
document.addEventListener('DOMContentLoaded', () => {
    loadValuesFromLocalStorage();
    // Also perform an initial calculation to display results on page load
    calculateAndSave();
});
