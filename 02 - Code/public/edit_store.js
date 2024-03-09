document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const district = urlParams.get('district');
    const url = urlParams.get('url');
    const rating = urlParams.get('rating');
    const mapsurl = urlParams.get('mapsurl');
    
    const id = await getID(decodeURIComponent(name), decodeURIComponent(district)); // Hier auf die ID warten

    fillStoreInformation(name, district, url, rating, mapsurl);

    document.querySelector('.save-button').addEventListener('click', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const district = document.getElementById('district').value;
        const url = document.getElementById('url').value;
        const rating = parseFloat(document.getElementById('rating').value);
        const mapsurl = document.getElementById('mapsURL').value;

        if (!name || !district) {
            document.getElementById('name').placeholder = 'Name is required';
            document.getElementById('district').placeholder = 'District is required';
            return;
        } else {
            const response = await fetch(`/api/edit-store?id=${id}&name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}&district=${encodeURIComponent(district)}&rating=${rating}&mapsurl=${encodeURIComponent(mapsurl)}`);
            const data = await response.json();

            if (data.message === 'Edit successful') {
                alert('Edit successfully');
            } else {
                alert('Edit failed');
                console.error(data.message);
            }
        }
    });
})

async function fillStoreInformation(name, district, url, rating, mapsURL) {
    document.getElementById('name').value = name || '';
    document.getElementById('district').value = district || '';
    document.getElementById('url').value = url || '';
    document.getElementById('rating').value = rating || '';
    document.getElementById('mapsURL').value = mapsURL || '';
}

async function getID(name, district) {
    const response = await fetch(`/api/get-store-id?name=${encodeURIComponent(name)}&district=${encodeURIComponent(district)}`);
    const data = await response.json();
    return data.id;
}