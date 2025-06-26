// Function to get a number value from an input field, defaulting if not found or invalid
function getInputValue(id, defaultValue) {
    const element = document.getElementById(id);
    let value = parseFloat(element.value);
    if (isNaN(value) || element.value.trim() === '') { // Also check for empty string
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
    document.getElementById('VAT').value = localStorage.getItem('VAT') || '10'; // Value Added Tax
    document.getElementById('price_gram').value = localStorage.getItem('price_gram') || '68000000';
    document.getElementById('price_whole').value = localStorage.getItem('price_whole') || '68000000'; // Added price_whole to localStorage
    document.getElementById('Final-Price').value = localStorage.getItem('Final-Price') || '50';
}

// Function to perform the calculation and update the display
function calculateAndSave() {
    // Get values from input fields
    let profit = getInputValue('profit', 5);
    let wage = getInputValue('wage', 5);
    let VAT_rate = getInputValue('VAT', 10); // Renamed to VAT_rate to avoid conflict
    let price_gram = getInputValue('price_gram', 68000000);
    let price_whole = getInputValue('price_whole', 68000000);
    let final_price_user_input = getInputValue('Final-Price', 50); // Renamed for clarity

    // Save current values to localStorage
    setInputValueAndLocalStorage('profit', profit);
    setInputValueAndLocalStorage('wage', wage);
    setInputValueAndLocalStorage('VAT', VAT_rate);
    setInputValueAndLocalStorage('price_gram', price_gram);
    setInputValueAndLocalStorage('price_whole', price_whole);
    setInputValueAndLocalStorage('Final-Price', final_price_user_input);

    // --- Core Calculation for Weight ---
    // Calculate the components that determine the taxless price per gram
    let labor_cost_per_gram = 0.01 * wage * price_gram;
    let profit_markup_per_gram = (price_gram + labor_cost_per_gram) * profit / 100;
    let taxless_price_per_gram_calc = price_gram + labor_cost_per_gram + profit_markup_per_gram;

    let calculated_weight = 0; // Initialize calculated_weight
    if (taxless_price_per_gram_calc !== 0) {
        calculated_weight = price_whole / taxless_price_per_gram_calc;
    } else {
        console.warn("taxless_price_per_gram_calc is zero, cannot calculate weight.");
    }

    // Now that 'calculated_weight' is defined, use it for subsequent calculations
    let Raw_gold_price = price_gram * calculated_weight;
    let taxless_total_price = taxless_price_per_gram_calc * calculated_weight;

    // --- Tax Calculation based on your new definitions ---
    // This 'taxe' calculation seems to be the tax on the difference between taxless_total_price and Raw_gold_price
    let calculated_tax_amount = (taxless_total_price - Raw_gold_price) * VAT_rate / 100;

    // The 'final_price_user_input' is what the user *wants* the final price to be.
    // Let's assume you want to display the tax based on your calculated internal costs.
    let price_after_calculated_tax = taxless_total_price + calculated_tax_amount;

    // --- How to "reduce the tax" based on calculated_weight? ---
    // This is still unclear. Let's assume a hypothetical scenario:
    // For every gram of 'calculated_weight', the 'calculated_tax_amount' is reduced by a fixed amount (e.g., 1 unit of currency per gram)
    // You need to define this rule. For example:
    // let tax_reduction_per_gram = 0.5; // Example: reduce tax by 0.5 per gram of calculated_weight
    // let total_tax_reduction = calculated_weight * tax_reduction_per_gram;
    // let final_tax_to_display = Math.max(0, calculated_tax_amount - total_tax_reduction); // Ensure tax doesn't go below 0
    // let final_price_display = taxless_total_price + final_tax_to_display;

    // For now, I'll display the calculated_tax_amount and price_after_calculated_tax based on your current formulas.
    // If you want to use the 'final_price_user_input' for tax, please specify how it relates to 'taxless_total_price'

    // Update the display
    document.getElementById('display-weight').textContent = calculated_weight.toFixed(2);
    document.getElementById('display-tax').textContent = calculated_tax_amount.toFixed(2);
    document.getElementById('display-price-after-tax').textContent = price_after_calculated_tax.toFixed(2);
    // You can uncomment this if you want to display Raw_gold_price
    // document.getElementById('display-raw-gold-price').textContent = Raw_gold_price.toFixed(2);
}

// Load values when the script loads (i.e., when the page loads)
document.addEventListener('DOMContentLoaded', () => {
    loadValuesFromLocalStorage();
    // Also perform an initial calculation to display results on page load
    calculateAndSave();
});
