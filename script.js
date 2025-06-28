// Function to get a number value from an input field, defaulting if not found or invalid
function getInputValue(id, defaultValue) {
    const element = document.getElementById(id);
    let value = parseFloat(element.value);
    if (isNaN(value) || element.value.trim() === '') {
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
    document.getElementById('profit').value = localStorage.getItem('profit') || '5';
    document.getElementById('wage').value = localStorage.getItem('wage') || '5';
    document.getElementById('VAT').value = localStorage.getItem('VAT') || '10';
    document.getElementById('price_gram').value = localStorage.getItem('price_gram')  * 0.1 || '68000000';
    document.getElementById('price_whole').value = localStorage.getItem('price_whole') * 0.1 || '38695881';
   // document.getElementById('Final-Price').value = localStorage.getItem('Final-Price') || '50';
}

// Function to perform the calculation and update the display
function calculateAndSave() {
    // Get values from input fields
    let profit = getInputValue('profit', 5);
    let wage = getInputValue('wage', 5);
    let VAT_rate = getInputValue('VAT', 10);
    let price_gram = getInputValue('price_gram', 68000000);
    let price_whole = getInputValue('price_whole', 38695881);
    //let final_price_user_input = getInputValue('Final-Price', 50);

    // Save current values to localStorage
    setInputValueAndLocalStorage('profit', profit);
    setInputValueAndLocalStorage('wage', wage);
    setInputValueAndLocalStorage('VAT', VAT_rate);
    setInputValueAndLocalStorage('price_gram', price_gram);
    setInputValueAndLocalStorage('price_whole', price_whole);
   // setInputValueAndLocalStorage('Final-Price', final_price_user_input);

    // --- Core Calculation for Weight ---
    let labor_cost_per_gram = 0.01 * wage * price_gram;
    let profit_markup_per_gram = (price_gram + labor_cost_per_gram) * profit / 100;
    let tax_price_per_gram = (labor_cost_per_gram + profit_markup_per_gram) * VAT_rate / 100 ;
    let tax_price_per_gram_calc = price_gram + labor_cost_per_gram + profit_markup_per_gram + tax_price_per_gram ;

    let calculated_weight = 0;
    if (tax_price_per_gram_calc !== 0) {
        calculated_weight = price_whole / tax_price_per_gram_calc;
    } else {
        console.warn("tax_price_per_gram_calc is zero, cannot calculate weight.");
    }

    let Raw_gold_price = price_gram * calculated_weight;
    let tax_total_price = tax_price_per_gram_calc * calculated_weight;

    // --- Tax Calculation ---
    let calculated_tax_amount =  (tax_price_per_gram * calculated_weight);

    let price_after_calculated_tax =  (tax_total_price - calculated_tax_amount);

    // Update the display with formatted numbers
    // For weight, first ensure it's a number, then apply toLocaleString, and then toFixed if needed.
    // The toLocaleString method is more robust for localization.
    // Use 'fa-IR' locale for Persian number formatting.
    document.getElementById('display-weight').textContent = calculated_weight.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) ;
    document.getElementById('display-tax').textContent = calculated_tax_amount.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ;
    document.getElementById('display-price-after-tax').textContent = price_after_calculated_tax.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ;
}

// Load values when the script loads (i.e., when the page loads)
document.addEventListener('DOMContentLoaded', () => {
    loadValuesFromLocalStorage();
    calculateAndSave();
});
