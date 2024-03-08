document.addEventListener('DOMContentLoaded', () => {
    fetchStores();
    if (document.cookie.includes('session=my-session-cookie')) {
        const storeNav = document.querySelector('.store-nav');
        const addButton = document.createElement('div');
        addButton.classList.add('add');
        addbuttonHTML = `<a href=""> Add </a>`;
        addButton.innerHTML = addbuttonHTML;
        storeNav.appendChild(addButton);
    }
});

function fetchStores() {
    fetch('/api/stores')
        .then(response => response.json())
        .then(data => {
            data.forEach(store => {
                addStoreToDOM(store);
            });
        })
        .catch(error => console.error('Error fetching stores:', error));
}

function addStoreToDOM(store) {
    const storeItemsContainer = document.querySelector('.store-items');

    const storeItem = document.createElement('div');
    storeItem.classList.add('store-item');

    if (document.cookie.includes('session=my-session-cookie')) {
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

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

function showLocation(mapsurl) {
    var iframe = document.querySelector('.map iframe');
    var newSrc = mapsurl;
    iframe.src = newSrc;
}

