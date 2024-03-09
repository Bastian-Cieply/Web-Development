document.addEventListener('DOMContentLoaded', () => {
    // Event-Listener für Dropdown-Menüelemente hinzufügen
    document.addEventListener('click', event => {
        if (event.target.classList.contains('dropdown-item')) {
            event.preventDefault(); // Verhindern, dass der Link folgt
            const sortBy = event.target.textContent.toLowerCase(); // Wert aus dem Text des Links extrahieren
            fetchStores(isLoggedIn, sortBy);
        }
    });

    fetch('/api/user-logged-in')
    .then(response => response.json())
    .then(data => {
        isLoggedIn = data.message === "User is logged in";
        // Hier kannst du den Code ausführen, der vom Login-Status abhängig ist
        fetchStores(isLoggedIn, "name");
        if (isLoggedIn) {

            const gridContainer = document.querySelector('.grid-container');

            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Log out';
            const logoutGridItem = document.createElement('div');
            logoutGridItem.classList.add('grid-item');
            logoutGridItem.appendChild(logoutButton);
            gridContainer.appendChild(logoutGridItem);
            logoutButton.addEventListener('click', logout); // Keine () hier
        } else {
    
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
            loginButton.addEventListener('click', login);

            // Register-Knopf erstellen und hinzufügen
            const registerButton = document.createElement('button');
            registerButton.textContent = 'Register';
            const registerGridItem = document.createElement('div');
            registerGridItem.classList.add('grid-item');
            registerGridItem.appendChild(registerButton);
            gridContainer.appendChild(registerGridItem);
            registerButton.addEventListener('click', register);

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
    
    if (emailInput.value === '' || passwordInput.value === '') {
        displayErrorMessage('Email and password must be filled.');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    fetch('/api/login?email=' + email + '&password=' + password)
        .then(response => response.json())
        .then(data => {
            if (data.status === "Success") {
                // Bei erfolgreicher Anmeldung neu laden
                location.reload();
            } else {
                // Bei fehlgeschlagener Anmeldung Fehler anzeigen
                if (data === false) {
                    displayErrorMessage('Password not correct. Please try again.');
                } else {
                    console.log(data);
                    displayErrorMessage(data);
                }
            }
        })
        .catch(error => {
            displayErrorMessage('Email not registered. Please register first.');
        });
}

function displayErrorMessage(message) {
    const textElement = document.querySelector('.grid-item p');
    textElement.textContent = message;
}

function register() {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (emailInput.value === '' || passwordInput.value === '') {
        displayErrorMessage('Email and password must be filled.');
        return;
    }
    
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
                textElement.textContent = "Email already in use!";
            }
        })
        .catch(error => console.error('Error registering:', error));
}

function fetchStores(isLoggedIn, sortBy) {
    let sortOrder = 'asc'; // Standard-Sortierreihenfolge
    if (sortBy === 'rating') {
        sortOrder = 'desc'; // Wenn nach Bewertung sortiert wird, absteigende Reihenfolge verwenden
    }
    const queryParams = new URLSearchParams({ sortBy, sortOrder }).toString();

    const storeItemsContainer = document.querySelector('.store-items');

    // Zurücksetzen des Inhalts und Hinzufügen der Navigationsleiste
    storeItemsContainer.innerHTML = `
        <div class="store-nav">
            <div class="primary-navigation">
                <ul>
                    <li>
                        Sort &dtrif;
                        <ul class="dropdown">
                            <li><a href="#" class="dropdown-item">Name</a></li>
                            <li><a href="#" class="dropdown-item">District</a></li>
                            <li><a href="#" class="dropdown-item">Rating</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `;

    if (isLoggedIn) {
        const storeNav = document.querySelector('.store-nav');
        const addButton = document.createElement('div');
        addButton.classList.add('add');
        addbuttonHTML = `<a href="/add_store"> Add </a>`;
        addButton.innerHTML = addbuttonHTML;
        storeNav.appendChild(addButton);
    } else {
        const storeNav = document.querySelector('.store-nav');
        const addButton = document.createElement('div');
        addButton.classList.add('add');
        addbuttonHTML = `<p>Log in to add your store!</p>`;
        addButton.innerHTML = addbuttonHTML;
        storeNav.appendChild(addButton);
    }

    fetch(`/api/stores?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            // Geschäfte hinzufügen
            data.forEach(store => {
                addStoreToDOM(store, isLoggedIn);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Geschäfte:', error));
}

function addStoreToDOM(store, isLoggedIn) {
    const storeItemsContainer = document.querySelector('.store-items');

    const storeItem = document.createElement('div');
    storeItem.classList.add('store-item');

    if (isLoggedIn) {
        storeItem.innerHTML = `
            <div class="edit"><a href="/edit_store?id=${encodeURIComponent(store.id)}&name=${encodeURIComponent(store.name)}&district=${encodeURIComponent(store.district)}&url=${encodeURIComponent(store.url)}&rating=${encodeURIComponent(store.rating)}&mapsurl=${encodeURIComponent(store.mapsurl)}">Edit</a></div>
            <div class="name">${store.name}</div>
            <div class="delete"><a href="">Delete</a></div>
        `;
    } else {
        storeItem.innerHTML = `
            <div class="edit"></div>
            <div class="name">${store.name}</div>
            <div class="delete"></div>
        `;
    }

    if (store.mapsurl !== null) {
        storeItem.setAttribute('onclick', `showLocation('${store.mapsurl}')`);
    }

    if (store.district !== null) {
        storeItem.innerHTML += `<div class="address">District: ${store.district}</div>`;
    }

    if (store.url !== null) {
        storeItem.innerHTML += `<div class="website"><a href="https://${store.url}">Website</a></div>`;
    }

    if (store.rating !== null) {
        storeItem.innerHTML += `<div class="rating">Rating: ${store.rating}/5</div>`;
    }

    storeItemsContainer.appendChild(storeItem);

    const deleteButton = storeItem.querySelector('.delete a');
    if (deleteButton) {
        deleteButton.addEventListener('click', function(event) {
            event.preventDefault();
            deleteStore(store.name, store.district);
        });
    }
}

async function deleteStore(name, district) {
    try {
        const encodedName = encodeURIComponent(name);
        const encodedDistrict = encodeURIComponent(district);
        const id = await getID(encodedName, encodedDistrict);
        const response = await fetch(`/api/delete-store?id=${id}`);
        const data = await response.json();
        if (data.message === "Deleted successful") {
            location.reload();
        }
    } catch (error) {
        console.error('Error deleting store:', error);
    }
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
                console.log(data.message);
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

async function getID(name, district) {
    const response = await fetch(`/api/get-store-id?name=${name}&district=${district}`);
    const data = await response.json();
    return data.id;
}

