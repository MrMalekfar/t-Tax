var wage = 5
var profit = 5
var weight = 5
var price_gram = 68000000
var price_whole = 0
var Tax_10 = 0.1
document.getElementById('Final-Price').value = localStorage.getItem('Final-Price') || 50;
document.getElementById('wage').value = localStorage.getItem(wage') || 1700;
document.getElementById('profit').value = localStorage.getItem('profit') || 1400;
document.getElementById('price_gram').value = localStorage.getItem('price_gram');
weight = price_whole/(price_gram + 0.01 * wage * price_gram + (price_gram + 0.01 * wage * price_gram) * profit / 100 )
