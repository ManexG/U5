const headerNav = document.querySelector('.header__nav');

function init() {
    const user = localStorage.getItem('user');
    if (user) {
        if (user.role == 'admin') {
            headerNav.innerHTML = `
                <a class="header__nav__link" href="/index.html">Home</a>
                <a class="header__nav__link" href="/html/pizza_manager.html">Pizza Manager</a>
                <a class="header__nav__link" onclick="logout()" href="/index.html">Log Out</a>
            `;
        } else {
            headerNav.innerHTML = `
                <a class="header__nav__link" href="/index.html">Home</a>
                <a class="header__nav__link" href="/html/pizza_order.html">Pizza Order</a>
                <a class="header__nav__link" onclick="logout()" href="/index.html">Log Out</a>
            `;
        }
    } else {
        headerNav.innerHTML = `
            <a class="header__nav__link" href="/index.html">Home</a>
            <a class="header__nav__link" href="/html/login.html">Log In</a>
            <a class="header__nav__link" href="/html/signup.html">Sign Up</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
    init();
}

init();
