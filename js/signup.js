const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
let role = "client";

const toggleAdmin = document.getElementById('toggle-admin');
const toggleClient = document.getElementById('toggle-client');

async function signup(event) {
    event.preventDefault();
    if (name.value === '' || email.value === '' || role.value === '' || password.value === '') {
        alert('All fields are required');
        return;
    }

    const nameValue = name.value;
    const emailValue = email.value;
    const roleValue = role;
    const passwordValue = password.value;

    const user = {
        name: nameValue,
        email: emailValue,
        role: roleValue,
        password: passwordValue
    };

    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful!');
            console.log(data);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server');
    }

}


function onToggleRole(event) {
    if (event.srcElement == toggleAdmin) {
        role.value = 'admin';
        toggleAdmin.classList.add('active');
        toggleClient.classList.remove('active');
    } else {
        role.value = 'client';
        toggleClient.classList.add('active');
        toggleAdmin.classList.remove('active');
    }
}
