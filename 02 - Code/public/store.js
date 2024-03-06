document.addEventListener('DOMContentLoaded', () => {
    fetchStores();

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

    let storeHTML = `<h3>${store.name}</h3>`;

    console.log('Map URL:', store.mapsurl);

    if (store.mapsurl !== null) {
        storeItem.setAttribute('onclick', `showLocation('${store.mapsurl}')`);
    } 

    if (store.district !== null) {
        storeHTML += `<p>District: ${store.district}</p>`;
    }

    if (store.rating !== null) {
        storeHTML += `<p>Rating: ${store.rating}/5</p>`;
    }

    if (store.url !== null) {
        storeHTML += `<a href="https://${store.url}">Website</a>`;
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

function addButtons() {
    
}

