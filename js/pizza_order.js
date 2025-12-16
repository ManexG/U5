
const pizzaContainer = document.getElementById('pizza-options');
const sizeContainer = document.getElementById('size-options');
const ingredientsContainer = document.getElementById('ingredients-options');
const currentPriceElement = document.getElementById('current-price');
const orderForm = document.getElementById('order-form');

// Cart Elements
const cartContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const btnFinishOrder = document.getElementById('btn-finish-order');

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
let cart = []; // Array to store added pizzas

async function init() {
    try {
        // Autofill user info if available
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.name) document.getElementById('name').value = user.name;
            if (user.email) document.getElementById('email').value = user.email;
        }

        const response = await fetch('../data/pizzas.json');
        const data = await response.json();
        pizzas = data.pizzas;

        renderPizzas();
        renderSizes();
        renderIngredients();

        // Add event listeners for realtime calculation
        orderForm.addEventListener('change', calculateCurrentPrice);

        // Finish Order Button
        btnFinishOrder.addEventListener('click', finishOrder);

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

function calculateCurrentPrice() {
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

    currentPriceElement.textContent = `$${total.toFixed(2)}`;
    return total;
}

// Add to Cart Handler
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);
    const selectedPizzaId = formData.get('pizza');
    const selectedPizzaOriginal = pizzas.find(p => p.id == selectedPizzaId);

    if (!selectedPizzaOriginal) return;

    const currentPrice = calculateCurrentPrice();

    const pizzaItem = {
        name: selectedPizzaOriginal.name,
        size: formData.get('size'),
        ingredients: formData.getAll('ingredients'),
        price: currentPrice
    };

    cart.push(pizzaItem);
    renderCart();
    // Optional: Reset ingredients or keep settings? Keeping current selection is often better for ordering similar pizzas.
});

function renderCart() {
    cartContainer.innerHTML = '';
    let cartTotal = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Tu orden esta vacia</p>';
        btnFinishOrder.disabled = true;
    } else {
        btnFinishOrder.disabled = false;

        cart.forEach((item, index) => {
            cartTotal += item.price;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name} (${item.size})</h4>
                    <p>${item.ingredients.length > 0 ? item.ingredients.join(', ') : 'Sin ingredientes extra'}</p>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <button type="button" class="btn-remove" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });
    }

    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Expose to window for onclick handler in HTML
window.removeFromCart = removeFromCart;

function finishOrder() {
    if (cart.length === 0) return;

    const customerData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address) {
        alert('Por favor completa la informacion del cliente');
        return;
    }

    const fullOrder = {
        customer: customerData,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toISOString()
    };

    console.log('Final Order:', fullOrder);

    // Simulate updating unique_pizzas.json (the cart items) and orders.json (the full order)
    console.log('Sending to orders.json and unique_pizzas.json...');

    alert('Pedido realizado con exito! (Simulado)');

    // Clear cart and form
    cart = [];
    renderCart();
    orderForm.reset();
    calculateCurrentPrice(); // Reset price display
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
