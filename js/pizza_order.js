
const pizzaContainer = document.getElementById('pizza-options');
const sizeContainer = document.getElementById('size-options');
const ingredientsContainer = document.getElementById('ingredients-options');
const totalCostElement = document.getElementById('total-cost');
const orderForm = document.getElementById('order-form');

const sizes = [
    { name: 'Individual', priceMultiplier: 1.0 },
    { name: 'Chica', priceMultiplier: 1.2 },
    { name: 'Mediana', priceMultiplier: 1.4 },
    { name: 'Grande', priceMultiplier: 1.6 },
    { name: 'Extragrande', priceMultiplier: 1.8 },
    { name: 'Jumbo', priceMultiplier: 2.0 }
];

const ingredients = [
    { name: 'Extra Queso', price: 20 },
    { name: 'Champiñones', price: 15 },
    { name: 'Peperoni Extra', price: 25 },
    { name: 'Aceitunas', price: 15 },
    { name: 'Pimientos', price: 15 },
    { name: 'Cebolla', price: 10 }
];

let pizzas = [];

async function init() {
    try {
        const userStr = localStorage.getItem('user');
        console.log(userStr);
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log(user);
            if (user.name) document.getElementById('name').value = user.name;
            if (user.email) document.getElementById('email').value = user.email;
        }

        const response = await fetch('../data/pizzas.json');
        const data = await response.json();
        pizzas = data.pizzas;

        renderPizzas();
        renderSizes();
        renderIngredients();

        orderForm.addEventListener('change', calculateTotal);

    } catch (error) {
        console.error('Error loading pizzas:', error);
        pizzaContainer.innerHTML = '<p>Error loading menu.</p>';
    }
}

function renderPizzas() {
    pizzaContainer.innerHTML = '';
    pizzas.forEach((pizza, index) => {
        const option = document.createElement('div');
        option.className = 'form-option';
        option.innerHTML = `
            <input type="radio" name="pizza" id="pizza-${pizza.id}" value="${pizza.id}" ${index === 0 ? 'checked' : ''}>
            <label for="pizza-${pizza.id}">
                <span class="option-name">${pizza.name}</span>
                <span class="option-price">$${pizza.price}</span>
                <small>${pizza.description}</small>
            </label>
        `;
        pizzaContainer.appendChild(option);
    });
}

function renderSizes() {
    sizeContainer.innerHTML = '';
    sizes.forEach((size, index) => {
        const option = document.createElement('div');
        option.className = 'form-option';
        option.innerHTML = `
            <input type="radio" name="size" id="size-${index}" value="${size.name}" ${index === 2 ? 'checked' : ''} data-multiplier="${size.priceMultiplier}">
            <label for="size-${index}">${size.name}</label>
        `;
        sizeContainer.appendChild(option);
    });
}

function renderIngredients() {
    ingredientsContainer.innerHTML = '';
    ingredients.forEach((ing, index) => {
        const option = document.createElement('div');
        option.className = 'form-option checkbox-option';
        option.innerHTML = `
            <input type="checkbox" name="ingredients" id="ing-${index}" value="${ing.name}" data-price="${ing.price}">
            <label for="ing-${index}">
                <span>${ing.name}</span>
                <span class="ing-price">+$${ing.price}</span>
            </label>
        `;
        ingredientsContainer.appendChild(option);
    });
}

function calculateTotal() {
    let total = 0;

    // Get selected pizza base price
    const selectedPizzaId = document.querySelector('input[name="pizza"]:checked')?.value;
    const selectedPizza = pizzas.find(p => p.id == selectedPizzaId);

    if (selectedPizza) {
        let basePrice = parseFloat(selectedPizza.price);

        // Apply size multiplier
        const selectedSizeInput = document.querySelector('input[name="size"]:checked');
        const multiplier = selectedSizeInput ? parseFloat(selectedSizeInput.dataset.multiplier) : 1;

        total = basePrice * multiplier;

        // Add ingredients
        const selectedIngredients = document.querySelectorAll('input[name="ingredients"]:checked');
        selectedIngredients.forEach(ing => {
            total += parseFloat(ing.dataset.price);
        });
    }

    totalCostElement.textContent = `$${total.toFixed(2)}`;
    return total;
}

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);

    const selectedPizzaId = formData.get('pizza');
    const selectedPizza = pizzas.find(p => p.id == selectedPizzaId);

    const order = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        },
        order: {
            pizza: selectedPizza ? selectedPizza.name : 'Unknown',
            size: formData.get('size'),
            ingredients: formData.getAll('ingredients'),
            total: calculateTotal()
        },
        date: new Date().toISOString()
    };

    console.log('Order created:', order);
    alert('Orden creada exitosamente! (Simulada)\nCheca la consola para ver el JSON.');

    // In a real app, we would POST this to a server
    // For now we just log it as requested
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
