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
    // Column 1
    document.getElementById('profit1').value = localStorage.getItem('profit1') || '5';
    document.getElementById('wage1').value = localStorage.getItem('wage1') || '5';
    document.getElementById('VAT1').value = localStorage.getItem('VAT') || '10';
    document.getElementById('price_gram1').value = localStorage.getItem('price_gram1') || '6800000';
    document.getElementById('price_whole1').value = localStorage.getItem('price_whole1') || '6800000';

    // Column 2
    document.getElementById('profit2').value = localStorage.getItem('profit2') || '5';
    document.getElementById('wage2').value = localStorage.getItem('wage2') || '5';
    document.getElementById('VAT2').value = localStorage.getItem('VAT2') || '10';
    document.getElementById('price_gram2').value = localStorage.getItem('price_gram2') || '6800000';
    document.getElementById('price_whole2').value = localStorage.getItem('price_whole2') || '6800000';

    // Column 3
    document.getElementById('price_gram3').value = localStorage.getItem('price_gram3') || '6800000';
    document.getElementById('weight_input3').value = localStorage.getItem('weight_input3') || '1';
}

// Function to perform the calculation and update the display for a specific column
function calculateAndSave(columnId) {
    if (columnId === 'column1') {
        // --- Column 1 Calculation: Weight vs Price, Profit, Wage (VAT) ---
        let profit = getInputValue('profit1', 5);
        let wage = getInputValue('wage1', 5);
        let VAT_rate = getInputValue('VAT1', 10);
        let price_gram = getInputValue('price_gram1', 6800000);
        let price_whole = getInputValue('price_whole1', 6800000);

        setInputValueAndLocalStorage('profit1', profit);
        setInputValueAndLocalStorage('wage1', wage);
	setInputValueAndLocalStorage('VAT1', VAT_rate);
        setInputValueAndLocalStorage('price_gram1', price_gram);
        setInputValueAndLocalStorage('price_whole1', price_whole);

        let labor_cost_per_gram = 0.01 * wage * price_gram;
        let profit_markup_per_gram = (price_gram + labor_cost_per_gram) * profit / 100;
	let tax_price_per_gram = (labor_cost_per_gram + profit_markup_per_gram) * VAT_rate / 100 ;
        let total_cost_per_gram_vat = price_gram + labor_cost_per_gram + profit_markup_per_gram + tax_price_per_gram;

        let calculated_weight = 0;
        if (total_cost_per_gram_vat !== 0) {
            calculated_weight = price_whole / total_cost_per_gram_vat;
        } else {
            console.warn("total_cost_per_gram_vat is zero, cannot calculate weight for column 1.");
        }

        // For column 1, tax and price before tax are considered 0 or the raw price
        let calculated_tax_amount = tax_price_per_gram * calculated_weight; //  VAT 
        let price_before_calculated_tax = total_cost_per_gram_vat * calculated_weight - tax_price_per_gram * calculated_weight;

        document.getElementById('display-weight1').textContent = calculated_weight.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
        document.getElementById('display-tax1').textContent = calculated_tax_amount.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        document.getElementById('display-price-before-tax1').textContent = price_before_calculated_tax.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    } else if (columnId === 'column2') {
        // --- Column 2 Calculation: Price vs Weight, Profit, Wage, VAT (Original logic) ---
        let profit = getInputValue('profit2', 7);
        let wage = getInputValue('wage2', 20);
        let VAT_rate = getInputValue('VAT2', 10);
        let price_gram = getInputValue('price_gram2', 68000000);
        let weight2 = getInputValue('weight2', 0);

        setInputValueAndLocalStorage('profit2', profit);
        setInputValueAndLocalStorage('wage2', wage);
        setInputValueAndLocalStorage('VAT2', VAT_rate);
        setInputValueAndLocalStorage('price_gram2', price_gram);
        setInputValueAndLocalStorage('weight2', weight2);

        let labor_cost_per_gram = 0.01 * wage * price_gram;
        let profit_markup_per_gram = (price_gram + labor_cost_per_gram) * profit / 100;
        let base_price_per_gram_before_vat = price_gram + labor_cost_per_gram + profit_markup_per_gram;
        let tax_price_per_gram = (labor_cost_per_gram + profit_markup_per_gram) * VAT_rate / 100;
        let total_price_per_gram_with_vat = base_price_per_gram_before_vat + tax_price_per_gram;
	let total_price_with_vat = total_price_per_gram_with_vat * weight2;

        let calculated_tax_amount = tax_price_per_gram * weight2;
        let price_after_calculated_tax = (total_price_per_gram_with_vat * weight2);
	let price_before_calculated_tax = (base_price_per_gram_before_vat * weight2);
	let calculated_weight = 1;
        document.getElementById('display-weight2').textContent = price_before_calculated_tax.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        document.getElementById('display-tax2').textContent = calculated_tax_amount.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        document.getElementById('display-price-after-tax2').textContent = price_after_calculated_tax.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    } else if (columnId === 'column3') {
        // --- Column 3 Calculation: Price only vs Weight ---
        let price_gram = getInputValue('price_gram3', 68000000);
        let weight = getInputValue('weight_input3', 1);

        setInputValueAndLocalStorage('price_gram3', price_gram);
        setInputValueAndLocalStorage('weight_input3', weight);

        let total_price = price_gram * weight * 735 / 750;

        document.getElementById('display-total-price3').textContent = total_price.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
}

// Load values and perform initial calculations for all columns when the script loads
document.addEventListener('DOMContentLoaded', () => {
    loadValuesFromLocalStorage();
    calculateAndSave('column1');
    calculateAndSave('column2');
    calculateAndSave('column3');
});
