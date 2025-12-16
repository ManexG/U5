const pizzaTable = document.getElementById('pizza-table');
const pizzaHead = document.getElementById('pizza-head');
const pizzaBody = document.getElementById('pizza-body');

const name = document.getElementById('name');
const description = document.getElementById('description');
const price = document.getElementById('price');


function init() {
    loadPizzas();

}


function createPizza() {
    const pizza = {
        name: name.value,
        description: description.value,
        price: price.value
    }
}


function loadPizzas() {

}


function deletePizza() {

}


function updatePizza() {

}


init();
