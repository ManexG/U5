const email = document.getElementById('email');
const password = document.getElementById('password');

function login(event) {
    event.preventDefault();

    fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log(data);
            if (data.user.role === 'admin') {
                window.location.href = '/html/pizza_manager.html';
            } else {
                window.location.href = '/html/pizza_order.html';
            }
        })
        .catch(error => {
            console.error(error);
        });
}