document.addEventListener('DOMContentLoaded', () => {

    fetch('/api/user-logged-in')
    .then(response => response.json())
    .then(data => {
        isLoggedIn = data.message === "User is logged in";
        // Hier kannst du den Code ausführen, der vom Login-Status abhängig ist
        fetchStores(isLoggedIn);
        if (isLoggedIn) {
            // Add-Button erstellen und hinzufügen
            const storeNav = document.querySelector('.store-nav');
            const addButton = document.createElement('div');
            addButton.classList.add('add');
            addbuttonHTML = `<a href=""> Add </a>`;
            addButton.innerHTML = addbuttonHTML;
            storeNav.appendChild(addButton);

            const gridContainer = document.querySelector('.grid-container');

            // Textelement für user feedback (login) erstellen und hinzufügen
            const textElement = document.createElement('p');
            textElement.textContent = '';
            const textGridItem = document.createElement('div');
            textGridItem.classList.add('grid-item');
            textGridItem.appendChild(textElement);
            gridContainer.appendChild(textGridItem);

            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Log out';
            const logoutGridItem = document.createElement('div');
            logoutGridItem.classList.add('grid-item');
            logoutGridItem.appendChild(logoutButton);
            gridContainer.appendChild(logoutGridItem);
            logoutButton.addEventListener('click', logout); // Keine () hier
        } else {
            const storeNav = document.querySelector('.store-nav');
            const addButton = document.createElement('div');
            addButton.classList.add('add');
            addbuttonHTML = `<p>Log in to add stores!</p>`;
            addButton.innerHTML = addbuttonHTML;
            storeNav.appendChild(addButton);

            const gridContainer = document.querySelector('.grid-container');
        
            // Textbox für E-Mails erstellen und hinzufügen
            const emailInput = document.createElement('input');
            emailInput.setAttribute('type', 'email');
            emailInput.setAttribute('placeholder', 'Email');
            const emailGridItem = document.createElement('div');
            emailGridItem.classList.add('grid-item');
            emailGridItem.appendChild(emailInput);
            gridContainer.appendChild(emailGridItem);

            // Textbox für Passwörter erstellen und hinzufügen
            const passwordInput = document.createElement('input');
            passwordInput.setAttribute('type', 'password');
            passwordInput.setAttribute('placeholder', 'Password');
            const passwordGridItem = document.createElement('div');
            passwordGridItem.classList.add('grid-item');
            passwordGridItem.appendChild(passwordInput);
            gridContainer.appendChild(passwordGridItem);

            // Login-Knopf erstellen und hinzufügen
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Log in';
            const loginGridItem = document.createElement('div');
            loginGridItem.classList.add('grid-item');
            loginGridItem.appendChild(loginButton);
            gridContainer.appendChild(loginGridItem);
            loginButton.addEventListener('click', login); // Keine () hier

            // Register-Knopf erstellen und hinzufügen
            const registerButton = document.createElement('button');
            registerButton.textContent = 'Register';
            const registerGridItem = document.createElement('div');
            registerGridItem.classList.add('grid-item');
            registerGridItem.appendChild(registerButton);
            gridContainer.appendChild(registerGridItem);
            registerButton.addEventListener('click', register); // Keine () hier

            // Textelement für user feedback (login) erstellen und hinzufügen
            const textElement = document.createElement('p');
            textElement.textContent = '';
            const textGridItem = document.createElement('div');
            textGridItem.classList.add('grid-item');
            textGridItem.appendChild(textElement);
            gridContainer.appendChild(textGridItem);
        }
    })
    .catch(error => console.error('Fehler beim Überprüfen des Benutzerlogins:', error));
});

function login() {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    fetch('/api/login?email=' + email + '&password=' + password)
        .then(response => response.json())
        .then(data => {
            if (data.status === "Success") {
                // Do something after successful login
                location.reload();
            } else {
                // Do something after failed login
                const textElement = document.querySelector('.grid-item p');
                textElement.textContent = data.message;
            }
        })
        .catch(error => console.error('Error logging in:', error));
}

function register() {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    fetch('/api/register?email=' + email + '&password=' + password)
        .then(response => response.json())
        .then(data => {
            if (data.status === "Success") {
                // Do something after successful registration
                location.reload();
            } else {
                // Do something after failed registration
                const textElement = document.querySelector('.grid-item p');
                textElement.textContent = data.message;
            }
        })
        .catch(error => console.error('Error registering:', error));
}

function fetchStores(isLoggedIn) {
    fetch('/api/stores')
        .then(response => response.json())
        .then(data => {
            data.forEach(store => {
                addStoreToDOM(store, isLoggedIn);
            });
        })
        .catch(error => console.error('Error fetching stores:', error));
}

function addStoreToDOM(store, isLoggedIn) {
    const storeItemsContainer = document.querySelector('.store-items');

    const storeItem = document.createElement('div');
    storeItem.classList.add('store-item');

    if (isLoggedIn) {
        storeHTML = `<div class="edit"><a href="">Edit</a></div>
        <div class="name">${store.name}</div><div class="delete"><a href="">Delete</a></div>`;
    } else {
        storeHTML = `<div class="edit"></div>
        <div class="name">${store.name}</div><div class="delete"></div>`;
    }

    if (store.mapsurl !== null) {
        storeItem.setAttribute('onclick', `showLocation('${store.mapsurl}')`);
    } 

    if (store.district !== null) {
        storeHTML += `<div class="address">District: ${store.district}</div>`;
    }

    if (store.url !== null) {
        storeHTML += `<div class="website"><a href="https://${store.url}">Website</a></div>`;
    }

    if (store.rating !== null) {
        storeHTML += `<div class="rating">Rating: ${store.rating}/5</div>`;
    }

    storeItem.innerHTML = storeHTML;

    storeItemsContainer.appendChild(storeItem);
}

function myFunction(x) {
    x.classList.toggle("change");
    toggleSidebar();
}

function logout() {
    fetch('/api/logout')
        .then(response => response.json())
        .then(data => {
            if (data.message === "User logged out") {
                location.reload();
            } else {
                // Handle unsuccessful logout
            }
        })
        .catch(error => console.error('Error logging out:', error));
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

function showLocation(mapsurl) {
    var iframe = document.querySelector('.map iframe');
    var newSrc = mapsurl;
    iframe.src = newSrc;
}

